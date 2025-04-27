import { error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

import { type } from "arktype";

import { superValidate } from "sveltekit-superforms";
import { arktype } from "sveltekit-superforms/adapters";

import { db } from "$srv/db";
import { emailLowerCase, emailOnboardingsTable } from "$tb/email";
import { eq } from "drizzle-orm";

import { uint8ArrayStrictEqual } from "$srv/auth/key";

import { initCsrf } from "$srv/csrf";
import { sha256 } from "@oslojs/crypto/sha2";

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
    handle: "string",

    /**
     * Password
     */
    password: "string",

    /**
     * Confirm Password
     */
    confirm_password: "string",
});

const defaults: typeof schema.infer = {
    // get overwritten
    csrf: "",
    email: "",
    challenge: "",

    display: "",
    handle: "",

    password: "",
    confirm_password: "",
};

export const load = (async ({ url }) => {
    const emailUrlEncoded = url.searchParams.get("email");
    const challengeUrlEncoded = url.searchParams.get("token");

    if (!emailUrlEncoded || !challengeUrlEncoded) {
        error(400, { message: "Invalid Request" });
    }

    const email = decodeURIComponent(emailUrlEncoded);
    const challenge = decodeURIComponent(challengeUrlEncoded);

    const [challengeDetail] = await db
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
        );

    if (!challengeDetail) {
        error(400, { message: "No Challenge Found" });
    }

    const challegeVerifier = sha256(new TextEncoder().encode(
        `${email}:${challenge}`,
    ));

    const storedChallengeVerifier = new Uint8Array(challengeDetail.challenge);

    if (!uint8ArrayStrictEqual(challegeVerifier, storedChallengeVerifier)) {
        error(403, { message: "Invalid Challenge" });
    }

    const csrf = initCsrf();
    const form = await superValidate(arktype(schema, { defaults }));

    return { form, csrf, email, challenge };
}) satisfies PageServerLoad;

export const actions: Actions = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    default: async ({ request }) => {
    },
};
