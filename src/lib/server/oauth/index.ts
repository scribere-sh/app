import { dev } from "$app/environment";
import type { Handle } from "@sveltejs/kit";

import { cors } from "@elysiajs/cors";
import { serverTiming } from "@elysiajs/server-timing";
import { Elysia, t } from "elysia";

import { ProviderNameSchema } from "./providers";

const oauthPrefix = "/oauth";
const oauthHandler = new Elysia({ prefix: oauthPrefix })
    .use(
        serverTiming({
            enabled: dev,
        }),
    )
    .use(
        cors({
            credentials: false,
            methods: ["GET"],
            origin: true,
        }),
    )
    .guard(
        {
            params: t.Object({
                provider: ProviderNameSchema,
            }),
        },
        (app) =>
            app
                // #region Authorize
                .get("/:provider", ({ params: { provider } }) => {
                    console.info(`request is going to provider ${provider}, route is unimplemented`);
                })
                // #endregion
                // #region Callback
                .get("/:provider/callback", ({ params: { provider } }) => {
                    console.info(`request is going to callback for provider ${provider}, route is unimplmented`);
                }),
        // #endregion
    );

export const oauthServerHandle: Handle = async ({ event, resolve }) => {
    if (event.url.pathname.startsWith("/oauth")) {
        console.info("request is being passed to elysia handler for oauth");
        const response = await oauthHandler.handle(event.request);

        if (!response.ok) {
            console.warn(`elysia oauth handler returned code ${response.status}`);
        }

        return response;
    }

    return resolve(event);
};
