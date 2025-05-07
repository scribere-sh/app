import type { Actions, PageServerLoad } from "./$types";

import { fail, superValidate } from "sveltekit-superforms";
import { arktype } from "sveltekit-superforms/adapters";

import { type } from "arktype";

import { shake256 } from "@oslojs/crypto/sha3";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";

import { db } from "$srv/db";
import { changePasswordChallengesTable } from "$tb/auth";
import { emailAddressesTable, emailLowerCase } from "$tb/email";
import { usersTable } from "$tb/user";
import { eq } from "drizzle-orm";

import { generateTokenBytes } from "$srv/auth/token";
import { cleanupCsrf, initCsrf, validateCsrf } from "$srv/csrf";

import { sendUpdatePasswordEmail } from "$srv/email";

import { route } from "$lib/routes";

const schema = type({
    csrf: "string",
    email: "string.email",
});

const defaults: typeof schema.infer = {
    csrf: "",
    email: "",
};

// # Load
export const load: PageServerLoad = async () => {
    const form = await superValidate(arktype(schema, { defaults }));
    const csrf = initCsrf();

    return { form, csrf };
};

const THIRTY_MINUTES_IN_MILLISECONDS = 30 * 60 * 1000;

// # Action
export const actions: Actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, arktype(schema, { defaults }));
        const csrf = form.data.csrf;

        if (!form.valid) {
            console.warn("form is invalid");
            return fail(400, { form });
        }

        if (!validateCsrf(csrf)) {
            console.warn("csrf token was invalid");
            return fail(400, { form, message: "CSRF Error" });
        }

        // # - Query DB for Email
        const [userQuery] = await db.query
            .select({
                userId: emailAddressesTable.userId,
                displayName: usersTable.displayName,
            })
            .from(emailAddressesTable)
            .innerJoin(
                usersTable,
                eq(
                    emailAddressesTable.userId,
                    usersTable.id,
                ),
            )
            .where(eq(
                emailLowerCase(emailAddressesTable.email),
                form.data.email.toLowerCase(),
            ));

        // if the email address is unknown we pretend we succeeded.
        //
        // this is used to deter bad actors.
        //
        // the timeout is to make it feel like we actually did
        // something.
        //
        // it's stupid that we need to do this but we live in a society.
        if (!userQuery) {
            await new Promise(res => setTimeout(res, 100));
            return;
        }

        // # - Generate Challenge
        const id = generateTokenBytes(32);
        const challenge = generateTokenBytes(32);

        const challengeVerifier = shake256(32, challenge);

        const idEncoded = encodeBase32LowerCaseNoPadding(id);
        const challengeEncoded = encodeBase32LowerCaseNoPadding(challenge);

        const challengeURL = new URL(request.url);
        challengeURL.pathname = route("/auth/change-password/callback");
        challengeURL.searchParams.set("id", encodeURIComponent(idEncoded));
        challengeURL.searchParams.set("challenge", encodeURIComponent(challengeEncoded));

        // # - Send Email
        const emailSendResult = await sendUpdatePasswordEmail(
            form.data.email,
            userQuery.displayName,
            challengeURL.toString(),
        );

        if (emailSendResult.error || !emailSendResult.data) {
            console.error(emailSendResult);
            return fail(500, { form, csrf, message: "Failed to send change password email" });
        }

        // # - Store Challenge
        await db.query
            .insert(changePasswordChallengesTable)
            .values({
                id,
                challengeVerifier,
                emailRef: emailSendResult.data.id,
                userId: userQuery.userId,
                expires: new Date(Date.now() + THIRTY_MINUTES_IN_MILLISECONDS),
            });

        cleanupCsrf();

        // # - Success
        return { email: form.data.email };
    },
};
