import type { Env } from "../hono-kit";

import { arktypeValidator } from "@hono/arktype-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { type } from "arktype";

import { db } from "$srv/db";

import { emailAddressesTable, emailValidationsTable } from "$tb/email";

import { eq } from "drizzle-orm";

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
    // # PUT /update-details
    .put(
        "/update-details",
        arktypeValidator(
            "json",
            type({
                displayName: "string?",
                handle: "string?",
            }),
        ),
        (c) => {
            return c.json("unimplmented");
        },
    );
