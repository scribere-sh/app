import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

import { sha256 } from "@oslojs/crypto/sha2";
import { type } from "arktype";

import { fail, setError, superValidate } from "sveltekit-superforms";
import { arktype } from "sveltekit-superforms/adapters";

import { db } from "$srv/db";
import { passwordsTable } from "$tb/auth";
import { emailAddressesTable, emailLowerCase, emailOnboardingsTable } from "$tb/email";
import { usersTable } from "$tb/user";
import { eq, lt } from "drizzle-orm";

import { createArgon2 } from "$srv/auth/argon2";
import { setSecureToken, TOKEN_COOKIE_NAME } from "$srv/auth/cookie";
import { signJWT } from "$srv/auth/jwt";
import { uint8ArrayStrictEqual } from "$srv/auth/key";
import { checkPasswordStrength } from "$srv/auth/password";
import { generateSession } from "$srv/auth/session";

import { generateUid } from "$lib/uid";
import { cleanupCsrf, initCsrf, validateCsrf } from "$srv/csrf";

import { route } from "$lib/routes";

const schema = type({
    /**
     * CSRF Token
     *
     * (hidden)
     */
    csrf: "string",
    /**
     * Email address
     *
     * (hidden)
     */
    email: "string.email",
    /**
     * Challenge
     *
     * (hidden)
     */
    challenge: "string",

    /**
     * User's Display Name
     */
    display: "string",

    /**
     * User's Handle
     */
    handle: "/^[a-z0-9-_.]{3,50}$/",

    /**
     * Password
     */
    password: "12 < string < 3000",

    /**
     * Confirm Password
     */
    confirmPassword: "12 < string < 3000",
});

const defaults: typeof schema.infer = {
    // get overwritten
    csrf: "",
    email: "",
    challenge: "",

    display: "",
    handle: "",

    password: "",
    confirmPassword: "",
};

const validateEmailChallenge = async (email: string, challenge: string) => {
    const { 1: [challengeDetail] } = await db.query.batch([
        // delete expired challenges
        db.query
            .delete(emailOnboardingsTable)
            .where(lt(emailOnboardingsTable.expires, new Date())),
        // get challenge by id
        db.query
            .select({
                challenge: emailOnboardingsTable.challenge,
                expires: emailOnboardingsTable.expires,
            })
            .from(emailOnboardingsTable)
            .where(
                eq(
                    emailLowerCase(emailOnboardingsTable.email),
                    email.toLowerCase(),
                ),
            ),
    ]);

    if (!challengeDetail) {
        console.warn("challenge was supplied but doesn't match any stored challenge");
        return false;
    }

    const challegeVerifier = sha256(new TextEncoder().encode(
        `${email}:${challenge}`,
    ));

    const storedChallengeVerifier = new Uint8Array(challengeDetail.challenge);

    return uint8ArrayStrictEqual(challegeVerifier, storedChallengeVerifier);
};

// # Load
export const load = (async ({ url }) => {
    const emailUrlEncoded = url.searchParams.get("email");
    const challengeUrlEncoded = url.searchParams.get("token");

    if (!emailUrlEncoded || !challengeUrlEncoded) {
        console.warn("missing required query parameters");
        redirect(303, route("/auth/register"));
    }

    const email = decodeURIComponent(emailUrlEncoded);
    const challenge = decodeURIComponent(challengeUrlEncoded);

    if (!(await validateEmailChallenge(email, challenge))) {
        console.warn("challenge invalid or not found");
        redirect(303, route("/auth/register"));
    }

    const csrf = initCsrf();
    const form = await superValidate(arktype(schema, { defaults }));

    return { form, csrf, email, challenge };
}) satisfies PageServerLoad;

// # Action
export const actions: Actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, arktype(schema, { defaults }));

        if (!form.valid) {
            console.warn("form is invalid");
            return fail(400, { form });
        }

        if (!validateCsrf(form.data.csrf)) {
            console.warn("csrf token is invalid");
            return fail(400, { form, message: "CSRF Error" });
        }

        if (!(await validateEmailChallenge(form.data.email, form.data.challenge))) {
            console.warn("onboarding link expired");
            return fail(400, { form, message: "onboarding link has expired" });
        }

        const handleCount = await db.query.$count(
            usersTable,
            eq(
                usersTable.handle,
                form.data.handle,
            ),
        );

        if (handleCount > 0) {
            return setError(form, "handle", "handle is already taken");
        }

        // check that passwords match
        if (form.data.password !== form.data.confirmPassword) {
            console.warn("supplied password pair does not match");

            setError(form, "password", "passwords don't match");
            setError(form, "confirmPassword", "passwords don't match");

            return fail(400, { form });
        }

        // check the haveibeenpwned API for password matches
        if (!await checkPasswordStrength(form.data.password)) {
            console.warn("passwords were found on the pwned password list");

            setError(form, "password", "passwords was found to be pwned");

            return fail(400, { form });
        }

        // # - Create User

        // handle is valid
        // handle is not taken

        // password strength is valid
        // password confirmation is matched

        // csrf is valid

        // email challenge is verified
        // email is verified

        // display name doesn't get checked

        // we can create account

        let userId;
        let userIdIsUnique = false;
        let userIdGenerationAttempts = 0;

        // our ID generation doesn't have collision avoidance
        // I don't want to implement it
        //
        // according to infinite monkey theorem, this may run
        // forever, in reality I will be amased if it runs more than once
        do {
            userIdGenerationAttempts++;
            userId = generateUid();
            userIdIsUnique = (await db.query.$count(usersTable, eq(usersTable.id, userId))) === 0;
        } while (!userIdIsUnique);

        console.info(`generated UserId in ${userIdGenerationAttempts} attempt(s)`);

        const passwordHash = await createArgon2(form.data.password);

        await db.query.batch([
            // add user
            db.query
                .insert(usersTable)
                .values({
                    id: userId,
                    handle: form.data.handle,
                    displayName: form.data.display,
                }),
            // delete email from onboarding table
            db.query
                .delete(emailOnboardingsTable)
                .where(eq(
                    emailLowerCase(emailOnboardingsTable.email),
                    form.data.email.toLowerCase(),
                )),
            // add to emails table
            db.query
                .insert(emailAddressesTable)
                .values({
                    userId,
                    email: form.data.email,
                    isVerified: true,
                }),
            // add password
            db.query
                .insert(passwordsTable)
                .values({
                    userId,
                    hash: passwordHash,
                }),
        ]);

        // # - Sign Token
        const now_ms = Date.now();
        const now_s = now_ms / 1000;

        const SIX_DAYS_IN_SECONDS = 6 * 24 * 60 * 60;

        const expiry_s = now_s + SIX_DAYS_IN_SECONDS;

        const session = await generateSession(userId);

        const token = await signJWT({
            sub: userId,
            dis: form.data.display,
            han: form.data.handle,

            iss: "app.scribere.sh",

            sid: session,

            iat: Math.floor(now_s),
            exp: Math.floor(expiry_s),
            // clock skew
            nbf: Math.floor(now_s - 60),
        });

        // we set the cookie to expire later than it actually expires to allow the
        // auto-redirect functionality to work correctly.
        setSecureToken(TOKEN_COOKIE_NAME, token, new Date((expiry_s + SIX_DAYS_IN_SECONDS) * 1000));
        cleanupCsrf();

        // # - Success
        // funciton throws the redirect and returns `never`
        redirect(303, route("/"));
    },
};
