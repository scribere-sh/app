import type { Env } from "../hono-kit";

import { env } from "$env/dynamic/private";

// used in tsdoc
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ImagesBinding, ImagesError, ReadableStream } from "@cloudflare/workers-types";

import { arktypeValidator } from "@hono/arktype-validator";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";

import { type } from "arktype";

import { DisplayName, Handle } from "$lib/schema/user";

import { profanityMatcher } from "$srv/profanity";

import { db } from "$srv/db";
import { emailAddressesTable, emailLowerCase, emailValidationsTable } from "$tb/email";
import { usersTable } from "$tb/user";
import { eq, lt } from "drizzle-orm";

import { route } from "$lib/routes";
import { censorEmail } from "$lib/utils";
import { TOKEN_COOKIE_NAME } from "$srv/auth/cookie";
import { updateJWT } from "$srv/auth/jwt";
import { generateTokenString } from "$srv/auth/token";
import { sendVerifyEmailEmail } from "$srv/email";
import { uploadProfilePicture } from "$srv/r2/profile-picture";
import { sha256 } from "@oslojs/crypto/sha2";

interface ImageInfoWithoutSVG {
    format: string;
    fileSize: number;
    width: number;
    height: number;
}

const PROFILE_IMAGE_MAX_SIZE = 10 * 1024 * 1024;
const SIX_DAYS_IN_MILLISECONDS = 6 * 24 * 60 * 60 * 1000;
const THIRTY_MINUTES_IN_MILLISECONDS = 30 * 60 * 1000;

export default new Hono<Env>()
    .get("/details", async (c) => {
        const userId = c.get("user").id;

        const [response] = await db.query
            .select({
                emailAddress: emailAddressesTable.email,
                emailAddressInValidation: emailValidationsTable.email,
            })
            .from(emailAddressesTable)
            .where(eq(emailAddressesTable.userId, userId))
            .leftJoin(
                emailValidationsTable,
                eq(emailAddressesTable.userId, emailValidationsTable.userId),
            );

        if (!response) throw new HTTPException(404, { message: "user not found" });

        return c.json({
            ...response,

            emailAddress: censorEmail(response.emailAddress),
            emailAddressInValidation: response.emailAddressInValidation
                ? censorEmail(response.emailAddressInValidation)
                : null,
        });
    })
    .put(
        "/updateHandle",
        arktypeValidator(
            "json",
            type({
                handle: Handle,
            }),
        ),
        async (c) => {
            const { handle } = c.req.valid("json");

            if (profanityMatcher.hasMatch(handle)) {
                throw new HTTPException(400, { message: "watch your profanity." });
            }

            const usageCount = await db.query.$count(
                usersTable,
                eq(usersTable.handle, handle),
            );

            if (usageCount > 0) {
                throw new HTTPException(400, { message: "handle is taken" });
            }

            db.query
                .update(usersTable)
                .set({
                    handle,
                })
                .where(eq(usersTable.id, c.get("user").id));

            setCookie(
                c,
                TOKEN_COOKIE_NAME,
                await updateJWT(c.get("token"), { han: handle }),
                {
                    expires: new Date(Date.now() + SIX_DAYS_IN_MILLISECONDS),
                    path: "/",
                    secure: env.WE_IN_THIS_WORKER === "true",
                    httpOnly: true,
                    sameSite: "lax",
                },
            );

            return c.json({ message: "complete" });
        },
    )
    .put(
        "/updateDisplayName",
        arktypeValidator(
            "json",
            type({
                displayName: DisplayName,
            }),
        ),
        async (c) => {
            const { displayName } = c.req.valid("json");

            if (profanityMatcher.hasMatch(displayName)) {
                throw new HTTPException(400, { message: "watch your profanity." });
            }

            await db.query
                .update(usersTable)
                .set({
                    displayName,
                })
                .where(eq(usersTable.id, c.get("user").id));

            setCookie(
                c,
                TOKEN_COOKIE_NAME,
                await updateJWT(c.get("token"), { dis: displayName }),
                {
                    expires: new Date(Date.now() + SIX_DAYS_IN_MILLISECONDS),
                    path: "/",
                    secure: env.WE_IN_THIS_WORKER === "true",
                    httpOnly: true,
                    sameSite: "lax",
                },
            );

            return c.json({ message: "complete" });
        },
    )
    .put(
        "/updateProfilePicture",
        arktypeValidator(
            "form",
            type({
                file: "File",
            }),
        ),
        async (c) => {
            const body = await c.req.parseBody();
            const file = body["file"];

            if (typeof file === "string") {
                throw new HTTPException(400, {
                    message: "this is not an image, you have submitted a string",
                });
            }

            if (file.size > PROFILE_IMAGE_MAX_SIZE) {
                throw new HTTPException(400, { message: "image may be up to 10 MB" });
            }

            try {
                const imageInfo = await c.env.IMAGES.info(
                    file.stream() as ReadableStream<Uint8Array>,
                );

                if (imageInfo.format !== "image/svg+xml") {
                    const imageInfoButNotSvg = imageInfo as ImageInfoWithoutSVG;

                    if (
                        imageInfoButNotSvg.width > 1000
                        || imageInfoButNotSvg.height > 1000
                    ) {
                        throw new HTTPException(400, {
                            message: "image may be up to 1000x1000px",
                        });
                    }
                }
            } catch (e) {
                if (e instanceof HTTPException) throw e;
                const imgErr = e as ImagesError;

                /**
                 * @see {@link ImagesBinding#info}
                 */
                if (imgErr.code === 9412) {
                    throw new HTTPException(400, { message: "this is not an image" });
                }
            }

            const imageTransformer = c.env.IMAGES
                // @ts-expect-error cf is dumb
                .input(await file.arrayBuffer());

            const output = await imageTransformer
                .transform({
                    width: 250,
                    height: 250,
                    fit: "cover",
                })
                .output({
                    format: "image/webp",
                });

            const response = output.image();
            const reader = response.getReader();

            let buf = new Uint8Array();

            while (true) {
                const part = await reader.read();
                if (part.done) break;

                const tmp = new Uint8Array(buf.length + part.value.length);

                tmp.set(buf, 0);
                tmp.set(part.value, buf.length);

                buf = tmp;
            }

            await uploadProfilePicture(c.get("user").id, buf);

            return c.json({ message: "complete" });
        },
    )
    .put(
        "/updateEmailAddress",
        arktypeValidator(
            "json",
            type({
                email: "string.email",
            }),
        ),
        async (c) => {
            const { email } = c.req.valid("json");

            const { 1: challenges } = await db.query.batch([
                db.query
                    .delete(emailValidationsTable)
                    .where(lt(emailValidationsTable.expires, new Date())),
                db.query
                    .select({
                        email: emailValidationsTable.email,
                    })
                    .from(emailValidationsTable)
                    .where(eq(emailAddressesTable.userId, c.get("user").id)),
                db.query
                    .select({
                        email: emailValidationsTable.email,
                    })
                    .from(emailValidationsTable)
                    .where(
                        eq(
                            emailLowerCase(emailValidationsTable.email),
                            email.toLowerCase(),
                        ),
                    ),
            ]);

            if (challenges.length > 0) {
                console.warn("user already has email in validation");
                throw new HTTPException(400, {
                    message: "You may not attempt to verify multiple emails",
                });
            }

            const challengeToken = generateTokenString(32);
            const challegeVerifier = sha256(
                new TextEncoder().encode(`${email}:${challengeToken}`),
            );

            const challengeUrl = new URL(c.req.url);
            challengeUrl.pathname = route("/auth/verify-email");
            challengeUrl.searchParams.set("email", encodeURIComponent(email));
            challengeUrl.searchParams.set(
                "token",
                encodeURIComponent(challengeToken),
            );

            const emailSendResult = await sendVerifyEmailEmail(
                email,
                c.get("user").displayName,
                challengeUrl.toString(),
            );

            if (emailSendResult.error || !emailSendResult.data) {
                console.error(emailSendResult);
                throw new HTTPException(500, {
                    message: "Failed to send validation email",
                });
            }

            await db.query.insert(emailValidationsTable).values({
                userId: c.get("user").id,
                email,
                emailRef: emailSendResult.data.id,
                challenge: challegeVerifier,
                expires: new Date(Date.now() + THIRTY_MINUTES_IN_MILLISECONDS),
            });

            return c.json({
                message: "success, please check your inbox",
            });
        },
    );
