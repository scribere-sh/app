import { Hono } from "hono";

import type { Env } from "../hono-kit";

import { db } from "$srv/db";
import { teamsTable, teamUserRelationsTable } from "$tb/teams";
import { and, count, eq } from "drizzle-orm";

import { PERMISSION_BASE } from "$lib/schema/permission";
import { UidSchema } from "$lib/schema/uid";
import { accessControl } from "$srv/access";
import { userIsMemberOfTeam } from "$srv/access/team";
import { usersTable } from "$srv/db/schema/user";
import { arktypeValidator } from "@hono/arktype-validator";
import { type } from "arktype";
import { HTTPException } from "hono/http-exception";

export default new Hono<Env>()
    .get("/getUserTeams", async (c) => {
        // query all teams that the user has the member permission in (minimum required to be a part of a team)
        const query = await db.query
            .select({
                id: teamsTable.id,
                handle: teamsTable.handle,
                displayName: teamsTable.displayName,
                // description: teamsTable.description,
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

        if (query.length === 0) return c.json([]);

        // map each team to a lookup of how many instances there are of different users
        // with the member permission within each team.
        const memberCountQueryIter = query
            .map(({ id }) =>
                db
                    .query
                    .select({
                        count: count(teamUserRelationsTable.user),
                    })
                    .from(teamUserRelationsTable)
                    .where(
                        and(
                            eq(
                                teamUserRelationsTable.team,
                                id,
                            ),
                            eq(
                                teamUserRelationsTable.permission,
                                PERMISSION_BASE,
                            ),
                        ),
                    )
            );

        // run all queries atomically in batch, batch queries are guaranteed
        // to run in the same order they're given, as are the results of .map
        //
        // therefore the list in the original query is in the same order as this one
        // making it really easy to zip together.
        //
        // except JS doesn't have an iterator zip function, so we make do.
        const memberCountQuery: number[] = (
            await db
                .query
                .batch(
                    // @ts-expect-error - Manually Tested
                    memberCountQueryIter,
                )
        )
            .map(
                queryResult => queryResult[0].count,
            );

        // zip the iterators together and return
        return c.json(
            query
                .map((val, i) => {
                    return {
                        ...val,
                        memberCount: memberCountQuery[i],
                    };
                }),
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
    );
