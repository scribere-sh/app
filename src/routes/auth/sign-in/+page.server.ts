import type { Actions, PageServerLoad } from "./$types";

import { redirect } from "@sveltejs/kit";

import { eq } from "drizzle-orm";
import { or } from "drizzle-orm";

import { fail, setError, superValidate } from "sveltekit-superforms";
import { arktype } from "sveltekit-superforms/adapters";

import { type } from "arktype";

import { db } from "$srv/db";
import { passwordsTable } from "$tb/auth";
import { emailAddressesTable, emailLowerCase } from "$tb/email";
import { usersTable } from "$tb/user";

import { verifyArgon2 } from "$srv/auth/argon2";
import { setSecureToken, TOKEN_COOKIE_NAME } from "$srv/auth/cookie";
import { signJWT } from "$srv/auth/jwt";
import { generateSession } from "$srv/auth/session";

import { cleanupCsrf, initCsrf, validateCsrf } from "$srv/csrf";

import { route } from "$lib/routes";

// # Load

const schema = type({
    identifier: "string.email | /^[a-z0-9.-]{3,30}$/",
    password: "12 < string < 3000",
    csrf: "string",
});

const defaults: typeof schema.infer = {
    identifier: "",
    password: "",
    csrf: "",
};

export const load = (async () => {
    const form = await superValidate(arktype(schema, { defaults }));
    const csrf = initCsrf();

    return { form, csrf };
}) satisfies PageServerLoad;

// # Action

const SIX_DAYS_IN_SECONDS = 6 * 24 * 60 * 60;

export const actions: Actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, arktype(schema, { defaults }));

        if (!form.valid) {
            console.warn("form is invalid");
            return fail(400, { form });
        }

        if (!validateCsrf(form.data.csrf)) {
            console.warn("csrf token was invalid");
            return fail(400, { form, message: "CSRF Error" });
        }

        console.info("checking user id");
        const { 0: query, length } = await db.query
            .select({
                userId: usersTable.id,
                handle: usersTable.handle,
                displayName: usersTable.displayName,
                passwordHash: passwordsTable.hash,
            })
            .from(usersTable)
            .leftJoin(emailAddressesTable, eq(usersTable.id, emailAddressesTable.userId))
            .innerJoin(passwordsTable, eq(usersTable.id, passwordsTable.userId))
            .where(
                or(
                    eq(
                        emailLowerCase(emailAddressesTable.email),
                        form.data.identifier.toLowerCase(),
                    ),
                    eq(usersTable.handle, form.data.identifier),
                ),
            )
            // allows us to detect if multiple users were matched
            // should be impossible but is worth checking
            .limit(2);

        if (length > 1) {
            // 2+ users were found
            console.warn("identifier has found multiple user ids");
            return setError(form, "identifier", "multiple users found", { status: 500 });
        }

        if (length === 0) {
            // no user found
            console.warn("identifier does not correlate to any user");
            return setError(form, "identifier", "no user found", { status: 404 });
        }

        if (!(await verifyArgon2(query.passwordHash, form.data.password))) {
            // password invalid
            console.warn("provided password is invalid");
            return setError(form, "password", "invalid password", { status: 403 });
        }

        // from here:
        // - user id is found
        // - password is correct
        // we can now give the user a token

        // # - Sign Token
        const now = new Date();
        const now_s = now.getTime() / 1000;

        const expiry_s = now_s + SIX_DAYS_IN_SECONDS;

        console.info("generating session & token");
        const session = await generateSession(query.userId);

        const signedJwt = await signJWT({
            sub: query.userId,
            dis: query.displayName,
            han: query.handle,

            iss: "app.scribere.sh",

            sid: session,

            exp: Math.floor(expiry_s),
            iat: Math.floor(now_s),
            // clock skew
            nbf: Math.floor(now_s - 60),
        });

        const expiryDate = new Date((expiry_s + SIX_DAYS_IN_SECONDS) * 1000);

        cleanupCsrf();
        // we set the cookie to expire later than it actually expires to allow the
        // auto-redirect functionality to work correctly.
        setSecureToken(TOKEN_COOKIE_NAME, signedJwt, expiryDate);

        console.info("success: redirecting");
        // funciton throws the redirect and returns `never`
        redirect(303, route("/"));
    },
};
