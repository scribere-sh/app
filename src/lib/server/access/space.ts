import { and, eq } from "drizzle-orm";

import { db } from "$srv/db";

import { spacesTable } from "$tb/space";
import { teamUserRelationsTable } from "$tb/teams";

import { type Permission, PERMISSION_READ_SPACE } from "$lib/schema/permission";

export const userHasPermissionForSpace = async (userId: string, spaceId: string, permission: Permission) => {
    const teamQuery = await db.query
        .select({ team: spacesTable.team })
        .from(spacesTable)
        .where(
            eq(spacesTable.id, spaceId),
        );

    if (teamQuery.length < 1) return false;

    const [{ team: teamId }] = teamQuery;

    return (
        await db.query
            .$count(
                teamUserRelationsTable,
                and(
                    eq(teamUserRelationsTable.team, teamId),
                    eq(teamUserRelationsTable.user, userId),
                    eq(teamUserRelationsTable.permission, permission),
                ),
            )
    ) > 0;
};

export const userCanAccessSpace = (userId: string, spaceId: string) =>
    userHasPermissionForSpace(userId, spaceId, PERMISSION_READ_SPACE);
