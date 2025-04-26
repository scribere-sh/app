import { building, dev } from "$app/environment";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

import { env } from "$env/dynamic/private";

if (!building && !env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
if (!dev && !building && !env.DATABASE_AUTH_TOKEN) {
    throw new Error("DATABASE_AUTH_TOKEN is not set");
}

const client = (
    !building
        ? createClient({
            url: env.DATABASE_URL,
            authToken: env.DATABASE_AUTH_TOKEN,
        })
        : null
)!;

export const db = (!building ? drizzle(client, { schema }) : null)!;
