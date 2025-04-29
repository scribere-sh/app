import { getRequestEvent } from "$app/server";

import { Elysia } from "elysia";

/**
 * This is cursed.
 *
 * I call it ElysiaKit because that's the monstrosity
 * I have created.
 */
export default new Elysia({
    name: "platform",
    aot: false,
})
    /**
     * # Cursed
     *
     * This cursed derive that makes ElysiaKit the the we
     * all know and love.
     */
    .derive(
        { as: "global" },
        ({ error }) => {
            const { platform, locals, cookies } = getRequestEvent();

            if (!platform) {
                console.error("couldn't get platform APIs");
                return error(500, "Internal Server Error");
            }

            return {
                platform,
                cookies,
                user: locals.user,
            };
        },
    );
