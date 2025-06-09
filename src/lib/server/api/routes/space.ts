import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Env } from "../hono-kit";

import { accessControl } from "$srv/access";
import { userCanAccessSpace } from "$srv/access/space";

import { db } from "$srv/db";
import { spacesTable } from "$srv/db/schema/space";
import { eq } from "drizzle-orm";

export default new Hono<Env>()
    .get("/:spaceId/details", async (c) => {
        const { spaceId } = c.req.param();

        await accessControl(
            () =>
                userCanAccessSpace(
                    c.get("user").id,
                    spaceId,
                ),
        );

        const [space] = await db.query
            .select()
            .from(spacesTable)
            .where(eq(spacesTable.id, spaceId))
            .limit(1);

        if (!space) {
            throw new HTTPException(404, { message: "space not found" });
        }

        return c.json(space);
    });
