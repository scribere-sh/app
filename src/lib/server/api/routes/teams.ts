import { Hono } from "hono";

import type { Env } from "../hono-kit";

import { db } from "$srv/db";
import { teamsTable, teamUserRelationsTable } from "$tb/teams";
import { and, desc, eq } from "drizzle-orm";

import {
    PERMISSION_BASE,
    PERMISSION_SPACE_OWNER,
    PERMISSION_UPDATE_TEAM,
    PERMISSION_WRITE_SPACE,
} from "$lib/schema/permission";
import { UidSchema } from "$lib/schema/uid";
import { generateUid } from "$lib/uid";
import { accessControl } from "$srv/access";
import { userHasPermissionInTeam, userIsMemberOfTeam } from "$srv/access/team";
import { pagesTable } from "$srv/db/schema/page";
import { spacesTable } from "$srv/db/schema/space";
import { usersTable } from "$srv/db/schema/user";
import { arktypeValidator } from "@hono/arktype-validator";
import { type } from "arktype";
import { HTTPException } from "hono/http-exception";

const EMPTY_DOC = { type: "doc", content: {} };

export default new Hono<Env>()
    .get("/getUserTeams", async (c) => {
        // query all teams that the user has the member permission in (minimum required to be a part of a team)
        const query = await db.query
            .select({
                id: teamsTable.id,
                handle: teamsTable.handle,
                displayName: teamsTable.displayName,
                memberCount: db.query
                    .$count(
                        teamUserRelationsTable,
                        and(
                            eq(
                                teamUserRelationsTable.team,
                                teamsTable.id,
                            ),
                            eq(
                                teamUserRelationsTable.permission,
                                PERMISSION_BASE,
                            ),
                        ),
                    ),
                spaceCount: db.query
                    .$count(
                        spacesTable,
                        eq(
                            spacesTable.team,
                            teamsTable.id,
                        ),
                    ),
            })
            .from(teamUserRelationsTable)
            .where(
                and(
                    eq(
                        teamUserRelationsTable.user,
                        c.get("user").id,
                    ),
                    eq(
                        teamUserRelationsTable.permission,
                        PERMISSION_BASE,
                    ),
                ),
            )
            .rightJoin(
                teamsTable,
                eq(
                    teamUserRelationsTable.team,
                    teamsTable.id,
                ),
            );

        // zip the iterators together and return
        return c.json(
            query,
        );
    })
    .get(
        "/getTeamDetails",
        arktypeValidator(
            "query",
            type({
                team: UidSchema,
            }),
        ),
        async (c) => {
            await accessControl(
                () =>
                    userIsMemberOfTeam(
                        c.get("user").id,
                        c.req.valid("query").team,
                    ),
            );

            const { team: teamId } = c.req.valid("query");

            const [teamQuery, membersQuery] = await db.query.batch([
                db.query
                    .select({
                        handle: teamsTable.handle,
                        displayName: teamsTable.displayName,

                        description: teamsTable.description,
                    })
                    .from(teamsTable)
                    .where(
                        eq(teamsTable.id, teamId),
                    ),
                db.query
                    .select({
                        id: usersTable.id,

                        displayName: usersTable.displayName,
                        handle: usersTable.handle,
                    })
                    .from(teamUserRelationsTable)
                    .where(
                        and(
                            eq(teamUserRelationsTable.team, teamId),
                            eq(teamUserRelationsTable.permission, PERMISSION_BASE),
                        ),
                    )
                    .rightJoin(
                        usersTable,
                        eq(teamUserRelationsTable.user, usersTable.id),
                    )
                    .limit(4),
            ]);

            if (teamQuery.length < 1) {
                throw new HTTPException(500, {
                    message: "How are you in this? YOU PASSED ACCESS CONTROL WHICH CHECKS TEAM AFFILIATION",
                });
            }

            const out = {
                ...teamQuery[0],
                id: teamId,

                members: membersQuery.map((val) => {
                    return {
                        ...val,
                        // todo: add this properly
                        activity: {
                            time: 3,
                            pageDisplay: "Test Page",
                        },
                    };
                }),
            };

            return c.json(out);
        },
    )
    .put(
        "/updateDescription",
        arktypeValidator(
            "json",
            type({
                content: "object",
            }),
        ),
        arktypeValidator(
            "query",
            type({
                team: "/[a-zA-Z0-9]/",
            }),
        ),
        async (c) => {
            await accessControl(
                () =>
                    userHasPermissionInTeam(
                        c.get("user").id,
                        c.req.valid("query").team,
                        PERMISSION_UPDATE_TEAM,
                    ),
            );

            // user is confirmed to be in team and have necessary permission
            await db.query
                .update(teamsTable)
                .set({
                    description: c.req.valid("json").content,
                })
                .where(eq(
                    teamsTable.id,
                    c.req.valid("query").team,
                ));

            return c.json(c.req.valid("json").content);
        },
    )
    .get(
        "/getSpaces",
        arktypeValidator(
            "query",
            type({
                team: "/[a-zA-Z0-9]/",
            }),
        ),
        async (c) => {
            const userId = c.get("user").id;
            const teamId = c.req.valid("query").team;

            await accessControl(
                () => userIsMemberOfTeam(userId, teamId),
            );

            const spaceList = await db.query
                .select({
                    id: spacesTable.id,
                    title: spacesTable.title,
                    homepage: spacesTable.homepage,
                    createdAt: spacesTable.createdAt,
                    pageCount: db.query.$count(pagesTable, eq(pagesTable.space, spacesTable.id)),
                })
                .from(spacesTable)
                .where(
                    eq(spacesTable.team, teamId),
                )
                .orderBy(
                    desc(spacesTable.createdAt),
                );

            return c.json(spaceList);
        },
    )
    .post(
        "/createSpace",
        arktypeValidator(
            "query",
            type({
                team: "/[a-zA-Z0-9]/",
            }),
        ),
        arktypeValidator(
            "json",
            type({
                title: "2 < string < 35",
            }),
        ),
        async (c) => {
            const userId = c.get("user").id;
            const teamId = c.req.valid("query").team;

            await accessControl(
                () => userIsMemberOfTeam(userId, teamId),
                () => userHasPermissionInTeam(userId, teamId, PERMISSION_WRITE_SPACE),
            );

            const { title } = c.req.valid("json");

            console.log("Creating space with", title, "for team", teamId);

            const spaceId = generateUid();
            const homepageId = generateUid();

            await db.query
                .batch([
                    db.query
                        .insert(spacesTable)
                        .values({
                            id: spaceId,
                            team: teamId,
                            title,
                            createdAt: new Date(),
                            homepage: homepageId,
                        }),
                    db.query
                        .insert(pagesTable)
                        .values({
                            id: homepageId,
                            space: spaceId,
                            title: `${title} - Home`,
                            content: EMPTY_DOC,
                            lastUpdated: new Date(),
                        }),
                ]);

            return c.json({
                spaceId,
                homepageId,
            });
        },
    )
    .post(
        "/create",
        arktypeValidator(
            "json",
            type({
                name: "string",
            }),
        ),
        async (c) => {
            const teamId = generateUid();
            const userId = c.get("user").id;

            const { name } = c.req.valid("json");

            await db.query.batch([
                db.query
                    .insert(teamsTable)
                    .values({
                        displayName: name,
                        // i cba checking this, sooooo
                        handle: teamId,
                        id: teamId,
                        description: { type: "doc", content: [] },
                    }),
                db.query
                    .insert(teamUserRelationsTable)
                    .values([
                        {
                            permission: PERMISSION_BASE,
                            team: teamId,
                            user: userId,
                        },
                        {
                            permission: PERMISSION_SPACE_OWNER,
                            team: teamId,
                            user: userId,
                        },
                    ]),
            ]);
        },
    );
