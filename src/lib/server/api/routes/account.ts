import type { Env } from "../hono-kit";
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
import { emailAddressesTable, emailValidationsTable } from "$tb/email";
import { usersTable } from "$tb/user";
import { eq } from "drizzle-orm";

import { TOKEN_COOKIE_NAME } from "$srv/auth/cookie";
import { updateJWT } from "$srv/auth/jwt";
import { uploadProfilePicture } from "$srv/r2/profile-picture";

interface ImageInfoWithoutSVG {
    format: string;
    fileSize: number;
    width: number;
    height: number;
}

const PROFILE_IMAGE_MAX_SIZE = 10 * 1024 * 1024;
const SIX_DAYS_IN_MILLISECONDS = 6 * 24 * 60 * 60 * 1000;

export default new Hono<Env>()
    // # GET /details
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
                eq(
                    emailAddressesTable.userId,
                    emailValidationsTable.userId,
                ),
            );

        if (!response) throw new HTTPException(404, { message: "user not found" });

        return c.json(response);
    })
    // # PUT /update-handle
    .put(
        "/update-handle",
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

            const usageCount = await db.query
                .$count(
                    usersTable,
                    eq(
                        usersTable.handle,
                        handle,
                    ),
                );

            if (usageCount > 0) {
                throw new HTTPException(400, { message: "handle is taken" });
            }

            db.query
                .update(usersTable)
                .set({
                    handle,
                })
                .where(eq(
                    usersTable.id,
                    c.get("user").id,
                ));

            setCookie(
                c,
                TOKEN_COOKIE_NAME,
                await updateJWT(c.get("token"), { han: handle }),
                {
                    expires: new Date(Date.now() + SIX_DAYS_IN_MILLISECONDS),
                    path: "/",
                    secure: import.meta.env.PROD,
                    httpOnly: true,
                    sameSite: "lax",
                },
            );

            return c.json({ message: "complete" });
        },
    )
    // # PUT /update-display-name
    .put(
        "/update-display-name",
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
                .where(eq(
                    usersTable.id,
                    c.get("user").id,
                ));

            setCookie(
                c,
                TOKEN_COOKIE_NAME,
                await updateJWT(c.get("token"), { dis: displayName }),
                {
                    expires: new Date(Date.now() + SIX_DAYS_IN_MILLISECONDS),
                    path: "/",
                    secure: import.meta.env.PROD,
                    httpOnly: true,
                    sameSite: "lax",
                },
            );

            return c.json({ message: "complete" });
        },
    )
    // # PUT /update-profile-picture
    .put(
        "/update-profile-picture",
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
                throw new HTTPException(400, { message: "this is not an image, you have submitted a string" });
            }

            if (file.size > PROFILE_IMAGE_MAX_SIZE) {
                throw new HTTPException(400, { message: "image may be up to 10 MB" });
            }

            try {
                const imageInfo = await c.env.IMAGES.info(file.stream() as ReadableStream<Uint8Array>);

                if (imageInfo.format !== "image/svg+xml") {
                    const imageInfoButNotSvg = imageInfo as ImageInfoWithoutSVG;

                    if (imageInfoButNotSvg.width > 1000 || imageInfoButNotSvg.height > 1000) {
                        throw new HTTPException(400, { message: "image may be up to 1000x1000px" });
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
    );
