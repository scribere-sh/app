import { Hono } from "hono";
// import { HTTPException } from "hono/http-exception";
import type { Env } from "../hono-kit";

import { accessControl } from "$srv/access";
import { userCanAccessSpace, userHasPermissionForSpace } from "$srv/access/space";

import { db } from "$srv/db";
// import { spacesTable } from "$srv/db/schema/space";
import { pagesTable } from "$srv/db/schema/page";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { PERMISSION_WRITE_SPACE } from "$lib/schema/permission";
import { arktypeValidator } from "@hono/arktype-validator";
import { type } from "arktype";

export default new Hono<Env>()
    .get(
        "/:pageId/content",
        async (c) => {
            const pageQuery = await db.query
                .select({
                    space: pagesTable.space,
                })
                .from(pagesTable)
                .where(eq(
                    pagesTable.id,
                    c.req.param("pageId"),
                ));

            if (pageQuery.length == 0) throw new HTTPException(404, { message: "Page not Found" });

            await accessControl(
                () =>
                    userCanAccessSpace(
                        c.get("user").id,
                        pageQuery[0].space,
                    ),
            );

            // we know it'll return because it did above
            const [pageContent] = await db.query
                .select({
                    title: pagesTable.title,
                    content: pagesTable.content,
                })
                .from(pagesTable)
                .where(eq(
                    pagesTable.id,
                    c.req.param("pageId"),
                ));

            return c.json(pageContent);
        },
    )
    .put(
        "/:pageId/update",
        arktypeValidator(
            "json",
            type({
                content: "object",
            }),
        ),
        async (c) => {
            const pageId = c.req.param("pageId");

            const [page] = await db.query
                .select({
                    space: pagesTable.space,
                })
                .from(pagesTable)
                .where(eq(
                    pagesTable.id,
                    pageId,
                ));

            if (!page) throw new HTTPException(404, { message: "page not found" });

            console.log("access control");

            await accessControl(
                () =>
                    userHasPermissionForSpace(
                        c.get("user").id,
                        page.space,
                        PERMISSION_WRITE_SPACE,
                    ),
            );

            console.log("access control passed");

            await db.query
                .update(pagesTable)
                .set({
                    content: c.req.valid("json").content,
                })
                .where(eq(
                    pagesTable.id,
                    pageId,
                ));

            return c.json({
                message: "OK",
            });
        },
    );
