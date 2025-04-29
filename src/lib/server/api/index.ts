import type { Handle } from "@sveltejs/kit";

import ElysiaKit from "$srv/api/elysia-kit";
import { Elysia } from "elysia";

import { cors } from "@elysiajs/cors";
import { serverTiming } from "@elysiajs/server-timing";

import RootRoutes from "./routes/root";

const apiPrefix = "/api";

const apiHandler = new Elysia({
    /**
     * Prefix so elysia's router works correctly
     */
    prefix: apiPrefix,
    /**
     * Disable ahead of time complication because it break cloudflare pages.
     *
     * This caused me untold pain for ages.
     *
     * Every Elysia instance must use this option.
     *
     * @see {@link https://github.com/elysiajs/elysia/issues/58}
     * @see {@link https://elysiajs.com/blog/elysia-06#dynamic-mode}
     */
    aot: false,
})
    .use(serverTiming())
    .use(
        cors({
            methods: ["GET", "POST", "PUT", "DELETE"],
            origin: true,
        }),
    )
    .use(ElysiaKit)
    .use(RootRoutes);

export type Api = typeof apiHandler;

export const apiServerHandler: Handle = async ({ event, resolve }) => {
    if (event.url.pathname.startsWith(apiPrefix)) {
        console.info("request is being passed to elysia handler for api");
        const response = await apiHandler.handle(event.request);

        if (!response.ok) {
            console.warn(`elysia api handler returned code ${response.status}`);
        }

        return response;
    }

    return resolve(event);
};
