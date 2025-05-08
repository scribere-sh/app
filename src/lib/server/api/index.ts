import type { QueryError } from "$lib/hc";
import type { Handle } from "@sveltejs/kit";

import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import Routes from "./routes";

const ApiHono = new Hono()
    .onError((err, c) => {
        if (err instanceof HTTPException) {
            c.status(err.status);
            console.warn("HTTPException thrown, returning error");
            return c.json({ name: err.name, message: err.message } satisfies QueryError);
        } else {
            // Any other error means server error
            c.status(500);
            console.error("server error occured within a hono handler", err);
            return c.json({ name: "Internal Server Error", message: "Unknown error has occured" } satisfies QueryError);
        }
    })
    .route("/api", Routes);

export type Api = typeof ApiHono;

export const apiServerHandler: Handle = async ({ event, resolve }) => {
    if (event.url.pathname.startsWith("/api")) {
        console.info("request is being passed to hono handler for api");
        const response = await ApiHono.fetch(event.request);

        if (!response.ok) {
            console.warn(`hono api handler returned code ${response.status}`);
        }

        return response;
    }

    return resolve(event);
};
