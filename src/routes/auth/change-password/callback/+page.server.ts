import type { Actions, PageServerLoad } from "./$types";

import { error, redirect } from "@sveltejs/kit";

import { shake256 } from "@oslojs/crypto/sha3";
import { decodeBase32IgnorePadding } from "@oslojs/encoding";
import { fail, setError, superValidate } from "sveltekit-superforms";
import { arktype } from "sveltekit-superforms/adapters";

import { type } from "arktype";

import { createArgon2 } from "$srv/auth/argon2";
import { uint8ArrayStrictEqual } from "$srv/auth/key";
import { checkPasswordStrength } from "$srv/auth/password";
import { initCsrf, validateCsrf } from "$srv/csrf";
import { setMessage } from "$srv/message";

import { db } from "$srv/db";
import { changePasswordChallengesTable, passwordsTable } from "$tb/auth";
import { eq, lt } from "drizzle-orm";

import { route } from "$lib/routes";

const schema = type({
    csrf: "string",
    id: "string",
    challenge: "string",

    password: "string",
    confirmPassword: "string",
});

const defaults: typeof schema.infer = {
    csrf: "",
    id: "",
    challenge: "",

    password: "",
    confirmPassword: "",
};

export const load: PageServerLoad = async ({ url }) => {
    const idEncoded = url.searchParams.get("id");
    const challengeEncoded = url.searchParams.get("challenge");

    if (!idEncoded || !challengeEncoded) {
        setMessage({
            type: "warning",
            content: "invalid change password request",
        });

        redirect(303, route("/auth/sign-in"));
    }

    try {
        const id = decodeBase32IgnorePadding(idEncoded);
        const challenge = decodeBase32IgnorePadding(challengeEncoded);

        const { 1: challengeLookup } = await db.query.batch([
            db.query
                .delete(changePasswordChallengesTable)
                .where(lt(changePasswordChallengesTable, new Date())),
            db.query
                .select({
                    verifier: changePasswordChallengesTable.challengeVerifier,
                })
                .from(changePasswordChallengesTable)
                .where(eq(
                    changePasswordChallengesTable.id,
                    id,
                )),
        ]);

        if (
            challengeLookup.length === 0 || !uint8ArrayStrictEqual(challengeLookup[0].verifier, shake256(32, challenge))
        ) {
            setMessage({
                type: "warning",
                content: "change password request is invalid or expired",
            });

            redirect(303, route("/auth/sign-in"));
        }

        const form = await superValidate(arktype(schema, { defaults }));
        const csrf = initCsrf();

        return {
            form,
            csrf,
            id: idEncoded,
            challenge: challengeEncoded,
        };
    } catch (e) {
        console.error("error during password reset", e);
        setMessage({
            type: "error",
            content: "server error during password reset",
        });

        redirect(303, route("/auth/sign-in"));
    }

    // this is intentionally unreachable.
    // if you see this something has gone catastrophically wrong
    error(500, { message: "how did we get here?" });
};

export const actions: Actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, arktype(schema, { defaults }));
        const csrf = form.data.csrf;

        if (!form.valid) {
            console.warn("form is invalid");
            return fail(400, { form, csrf });
        }

        if (!validateCsrf(csrf)) {
            console.warn("csrf token was invalid");
            return fail(400, { form, message: "CSRF Error" });
        }

        const id = decodeBase32IgnorePadding(form.data.id);
        const challenge = decodeBase32IgnorePadding(form.data.challenge);

        const { 1: challengeLookup } = await db.query.batch([
            db.query
                .delete(changePasswordChallengesTable)
                .where(lt(changePasswordChallengesTable, new Date())),
            db.query
                .select({
                    userId: changePasswordChallengesTable.userId,
                    verifier: changePasswordChallengesTable.challengeVerifier,
                })
                .from(changePasswordChallengesTable)
                .where(eq(
                    changePasswordChallengesTable.id,
                    id,
                )),
        ]);

        if (
            challengeLookup.length === 0 || !uint8ArrayStrictEqual(challengeLookup[0].verifier, shake256(32, challenge))
        ) {
            console.warn("challenge is invalid or expired");
            return fail(400, { form, message: "change password request is invalid or expired" });
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

        const passwordHash = await createArgon2(form.data.password);

        await db.query
            .update(passwordsTable)
            .set({
                hash: passwordHash,
            })
            .where(eq(
                passwordsTable.userId,
                challengeLookup[0].userId,
            ));

        console.info("updated user password");

        redirect(303, route("/auth/sign-in"));
    },
};
