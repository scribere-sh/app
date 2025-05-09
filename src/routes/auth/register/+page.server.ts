import type { Actions } from "./$types";

import { env } from "$env/dynamic/private";

import { fail, setError, superValidate } from "sveltekit-superforms";
import { arktype } from "sveltekit-superforms/adapters";

import { type } from "arktype";

import { sha256 } from "@oslojs/crypto/sha2";
import { eq, lt } from "drizzle-orm";

import { generateTokenString } from "$srv/auth/token";
import { cleanupCsrf, initCsrf, validateCsrf } from "$srv/csrf";
import { sendOnboardingEmail } from "$srv/email";

import { db } from "$srv/db";
import { emailAddressesTable, emailLowerCase, emailOnboardingsTable } from "$tb/email";

import { route } from "$lib/routes";

// # Load

const schema = type({
    email: "string.email",
    csrf: "string",
});

const defaults: typeof schema.infer = {
    email: "",
    csrf: "",
};

export const load = async () => {
    const csrf = initCsrf();
    const form = await superValidate(arktype(schema, { defaults }));

    return { form, csrf, accepting: env.ACCEPTING_REGISTRATIONS === "true" };
};

// # Action

const THIRTY_MINUTES_IN_MILLISECONDS = 30 * 60 * 1000;

export const actions: Actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, arktype(schema, { defaults }));
        const csrf = form.data.csrf;

        if (!form.valid) {
            console.warn("form is invalid");
            return fail(400, { form, csrf });
        }

        if (!validateCsrf(csrf)) {
            console.warn("csrf token is invalid");
            return fail(400, { form, csrf, message: "CSRF Error" });
        }

        // # - Query DB for email
        //
        // this returns an array, but arrays are objects with number keys, so we can do this
        //
        // welcome to javascript.
        const { 1: { length: emailAddressFoundCount }, 2: { length: emailOnboardingsFoundCount } } = await db.query
            .batch(
                [
                    // delete expired challenges
                    db.query
                        .delete(emailOnboardingsTable)
                        .where(lt(emailOnboardingsTable.expires, new Date())),
                    // select current email addresses
                    db.query
                        .select({
                            email: emailAddressesTable.email,
                        })
                        .from(emailAddressesTable)
                        .where(eq(emailLowerCase(emailAddressesTable.email), form.data.email.toLowerCase()))
                        .limit(1),
                    // select onboarding emails
                    db.query
                        .select({
                            email: emailOnboardingsTable.email,
                        })
                        .from(emailOnboardingsTable)
                        .where(eq(emailLowerCase(emailOnboardingsTable.email), form.data.email.toLowerCase()))
                        .limit(1),
                ],
            );

        // user with this email already in system
        if (emailAddressFoundCount > 0) {
            console.warn("email is in use");
            setError(form, "email", "email in use");
            return fail(403, { form, csrf });
        }

        // an onboarding email has already been set
        if (emailOnboardingsFoundCount > 0) {
            console.warn("email already sent");
            setError(form, "email", "email already sent");
            return fail(403, { form, csrf });
        }

        // allows us to toggle if we're accepting registrations
        // to prevent spamming.
        if (env.ACCEPTING_REGISTRATIONS !== "true") {
            console.warn("not accepting registrations at this time");
            setError(form, "email", "not accepting registrations");
            return fail(418, { form, message: "not accepting registrations" });
        }

        // # - Challenge Creation
        // create a challengeToken
        const challengeToken = generateTokenString(32);

        // create a Token Verifier
        //
        // the onboarding page must check this
        const challegeVerifier = sha256(new TextEncoder().encode(
            `${form.data.email}:${challengeToken}`,
        ));

        // generate the URL to be placed within the email
        const challengeURL = new URL(request.url);
        challengeURL.pathname = route("/auth/onboarding");
        challengeURL.searchParams.set("email", encodeURIComponent(form.data.email));
        challengeURL.searchParams.set("token", encodeURIComponent(challengeToken));

        const emailSendResult = await sendOnboardingEmail(form.data.email, challengeURL.toString());

        if (emailSendResult.error || !emailSendResult.data) {
            console.error(emailSendResult);
            return fail(500, { form, csrf, message: "Failed to send onboarding email." });
        }

        await db.query
            .insert(emailOnboardingsTable)
            .values({
                email: form.data.email,
                emailRef: emailSendResult.data.id,
                challenge: challegeVerifier,
                expires: new Date(Date.now() + THIRTY_MINUTES_IN_MILLISECONDS),
            });

        cleanupCsrf();

        // # - Success
        return { email: form.data.email };
    },
};
