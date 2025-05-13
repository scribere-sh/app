import type { PageServerLoad } from "./$types";

import { sha256 } from "@oslojs/crypto/sha2";
import { redirect } from "@sveltejs/kit";

import { uint8ArrayStrictEqual } from "$srv/auth/key";
import { setMessage } from "$srv/message";

import { db } from "$srv/db";
import { emailAddressesTable, emailLowerCase, emailValidationsTable } from "$tb/email";
import { eq, lt } from "drizzle-orm";

import { route } from "$lib/routes";

const validateEmailChallenge = async (email: string, challenge: string) => {
    const { 1: [challengeDetail] } = await db.query
        .batch([
            // delete expired challenges
            db.query
                .delete(emailValidationsTable)
                .where(lt(emailValidationsTable.expires, new Date())),
            // get challenge by id
            db.query
                .select({
                    challenge: emailValidationsTable.challenge,
                    userId: emailValidationsTable.userId,
                })
                .from(emailValidationsTable)
                .where(
                    eq(
                        emailLowerCase(emailValidationsTable.email),
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

    return uint8ArrayStrictEqual(challegeVerifier, storedChallengeVerifier)
        ? challengeDetail.userId
        : false;
};

export const load: PageServerLoad = async ({ url }) => {
    const emailUrlEncoded = url.searchParams.get("email");
    const challengeUrlEncoded = url.searchParams.get("token");

    if (!emailUrlEncoded || !challengeUrlEncoded) {
        console.warn("missing required query parameters");

        setMessage({
            type: "error",
            content: "Invalid or expired verification URL",
        });

        redirect(303, route("/"));
    }

    const email = decodeURIComponent(emailUrlEncoded);
    const challenge = decodeURIComponent(challengeUrlEncoded);

    const verifiedChallenge = await validateEmailChallenge(email, challenge);

    if (verifiedChallenge === false) {
        console.warn("challenge invalid or not found");

        setMessage({
            type: "error",
            content: "Invalid or expired verification",
        });

        redirect(303, route("/"));
    }

    await db.query.batch([
        db.query
            .update(emailAddressesTable)
            .set({
                email,
            })
            .where(eq(
                emailAddressesTable.userId,
                verifiedChallenge,
            )),
        db.query
            .delete(emailValidationsTable)
            .where(eq(
                emailLowerCase(emailValidationsTable.email),
                email.toLowerCase(),
            )),
    ]);

    setMessage({
        type: "success",
        content: "email address successfully changed",
    });

    // at the end redirect home.
    redirect(303, route("/account/settings"));
};
