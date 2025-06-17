import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Env } from "../hono-kit";

import { accessControl } from "$srv/access";
import { userCanAccessSpace } from "$srv/access/space";

import { db } from "$srv/db";
import { pagesTable } from "$srv/db/schema/page";
import { spacesTable } from "$srv/db/schema/space";
import { eq } from "drizzle-orm";

interface PageWithChildren {
    id: string;
    title: string;
    children?: PageWithChildren[];
}

const getChildPageDetails = async (pageId: string) => {
    const pages = await db.query
        .select({
            id: pagesTable.id,
            title: pagesTable.title,
        })
        .from(pagesTable)
        .where(eq(
            pagesTable.parent,
            pageId,
        ));

    if (pages.length == 0) return undefined;

    const returnValue: PageWithChildren[] = await Promise.all(pages
        .map(async (value) => ({
            ...value,
            children: await getChildPageDetails(value.id),
        })));

    return returnValue;
};

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
            .select({
                title: spacesTable.title,
                createdAt: spacesTable.createdAt,
                homepageId: spacesTable.homepage,
                team: spacesTable.team,
                pageCount: db.query
                    .$count(
                        pagesTable,
                        eq(spacesTable.id, pagesTable.space),
                    ),
            })
            .from(spacesTable)
            .where(eq(spacesTable.id, spaceId))
            .limit(1);

        if (!space) {
            throw new HTTPException(404, { message: "space not found" });
        }

        const rootPages = await getChildPageDetails(space.homepageId) ?? [];

        const [homepage] = await db.query
            .select({
                id: pagesTable.id,
                title: pagesTable.title,
            })
            .from(pagesTable)
            .where(eq(
                pagesTable.id,
                space.homepageId,
            ));

        return c.json({
            ...space,
            rootPages,
            homepage,
        });
    });
