import type { ImagesError } from "@cloudflare/workers-types";
import type { Actions, PageServerLoad } from "./$types";

import { initCsrf, validateCsrf } from "$srv/csrf";

import { db } from "$srv/db";
import { usersTable } from "$tb/user";
import { eq } from "drizzle-orm";

import { uploadProfilePicture } from "$srv/r2/profile-picture";

import { type } from "arktype";

import { setSecureToken, TOKEN_COOKIE_NAME } from "$srv/auth/cookie";
import { updateJWT } from "$srv/auth/jwt";
import { fail, setError, superValidate } from "sveltekit-superforms";
import { arktype } from "sveltekit-superforms/adapters";

const SIX_DAYS_IN_MILLISECONDS = 6 * 24 * 60 * 60 * 1000;

const updateProfileImageSchema = type({
    csrf: "string",
    image: "File",
});

const updateProfileImageDefaults: typeof updateProfileImageSchema.infer = {
    csrf: "",
    // @ts-expect-error - can't serialise an image
    image: null,
};

const PROFILE_IMAGE_MAX_SIZE = 10_000_000;

const updateDisplayNameSchema = type({
    csrf: "string",
    displayName: "string",
});

const updateDisplayNameDefaults: typeof updateDisplayNameSchema.infer = {
    csrf: "",
    displayName: "",
};

const updateHandleSchema = type({
    csrf: "string",
    handle: "string",
});

const updateHandleDefaults: typeof updateHandleSchema.infer = {
    csrf: "",
    handle: "",
};

export const load: PageServerLoad = async ({ locals }) => {
    return {
        csrf: initCsrf(),
        details: {
            updateProfilePicutreForm: await superValidate(
                arktype(updateProfileImageSchema, { defaults: updateProfileImageDefaults }),
            ),
            updateDisplayNameForm: await superValidate(
                arktype(updateDisplayNameSchema, {
                    defaults: { ...updateDisplayNameDefaults, displayName: locals.user.displayName },
                }),
            ),
            updateHandleForm: await superValidate(
                arktype(updateHandleSchema, { defaults: { ...updateHandleDefaults, handle: locals.user.handle } }),
            ),
        },
    };
};

export const actions: Actions = {
    updateProfilePicture: async ({ request, platform, locals }) => {
        console.log("uploading profile picture");

        const form = await superValidate(
            request,
            arktype(updateProfileImageSchema, { defaults: updateProfileImageDefaults }),
        );

        if (!form.valid) {
            console.warn("Form was invalid");
            return fail(400, { form });
        }

        if (!validateCsrf(form.data.csrf)) {
            console.warn("CSRF Error");
            return fail(400, { form, message: "CSRF Error" });
        }

        if (form.data.image.size > PROFILE_IMAGE_MAX_SIZE) {
            return setError(form, "image", "image may be up to 10 MB");
        }

        console.log("upload profile picture request is valid");

        if (!platform) throw new Error("unable to access platform APIs");

        const imagesApi = platform.env.IMAGES;

        try {
            // @ts-expect-error - cloudflare types are weird
            const imageInfo = await imagesApi.info(form.data.image.stream());

            if (imageInfo.format === "image/svg+xml") {
                // SVG is fine but we need to transform it.
            } else if (
                "width" in imageInfo && imageInfo.width > 1000 && "width" in imageInfo && imageInfo.height > 1000
            ) {
                return setError(form, "image", "image may be up to 1000x1000");
            }
        } catch (e) {
            const err = e as ImagesError;
            if ("code" in err && err.code === 9412) {
                console.warn("file is not a valid image");
                return setError(form, "image", "file is not a valid image");
            } else {
                console.error(e);
                return fail(500, { form, message: "internal server error" });
            }
        }

        // image is valid, csrf is valid
        console.log("image is of correct size");

        const imageTransformer = await imagesApi
            // @ts-expect-error - cf is dumb
            .input(await form.data.image.arrayBuffer());

        const output = await imageTransformer
            .transform({
                width: 250,
                height: 250,
                fit: "cover",
            })
            .output({ format: "image/webp" });

        console.log("image resized, downloading");

        const response = output.image();
        const reader = response.getReader();

        const bufs: Uint8Array[] = [];

        while (true) {
            const part = await reader.read();
            if (part.done) break;

            console.log(`reading part with length ${part.value.length}`);
            bufs.push(part.value);
        }

        const imageBufLength = bufs.map(buf => buf.length).reduce((prev, val) => prev + val, 0);

        const imageBuffer = new Uint8Array(imageBufLength);
        let currentWriteHead = 0;

        bufs.forEach(buf => {
            imageBuffer.set(buf, currentWriteHead);
            currentWriteHead += buf.length;
        });

        console.log("downloaded image from processing, uploading into r2");

        await uploadProfilePicture(locals.user.id, imageBuffer);

        console.log("profile picture updated");
    },

    updateDisplayName: async ({ request, locals }) => {
        const form = await superValidate(
            request,
            arktype(updateDisplayNameSchema, {
                defaults: { ...updateDisplayNameDefaults, displayName: locals.user.displayName },
            }),
        );

        if (!validateCsrf(form.data.csrf)) {
            console.warn("CSRF Error");
            return fail(400, { form, message: "CSRF Error" });
        }

        await db.query
            .update(usersTable)
            .set({
                displayName: form.data.displayName,
            })
            .where(eq(
                usersTable.id,
                locals.user.id,
            ));

        setSecureToken(
            TOKEN_COOKIE_NAME,
            await updateJWT(locals.token, { dis: form.data.displayName }),
            new Date(Date.now() + SIX_DAYS_IN_MILLISECONDS),
        );

        return { form };
    },

    updateHandle: async ({ request, locals }) => {
        const form = await superValidate(
            request,
            arktype(updateHandleSchema, { defaults: { ...updateHandleDefaults, handle: locals.user.handle } }),
        );

        if (!validateCsrf(form.data.csrf)) {
            console.warn("CSRF Error");
            return fail(400, { form, message: "CSRF Error" });
        }

        await db.query
            .update(usersTable)
            .set({
                handle: form.data.handle,
            })
            .where(eq(
                usersTable.id,
                locals.user.id,
            ));

        setSecureToken(
            TOKEN_COOKIE_NAME,
            await updateJWT(locals.token, { han: form.data.handle }),
            new Date(Date.now() + SIX_DAYS_IN_MILLISECONDS),
        );

        return { form };
    },
};
