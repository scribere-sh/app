import { and, count, eq } from "drizzle-orm";

import { db } from "$srv/db";

import { spacesTable } from "$tb/space";
import { teamUserRelationsTable } from "$tb/teams";

import { type Permission, PERMISSION_BASE } from "$lib/schema/permission";

export const userHasPermissionForSpace = async (userId: string, spaceId: string, permission: Permission) => {
    return (
        await db.query
            .select({
                count: count(teamUserRelationsTable.user),
            })
            .from(spacesTable)
            .rightJoin(
                teamUserRelationsTable,
                eq(
                    spacesTable.team,
                    teamUserRelationsTable.team,
                ),
            )
            .where(and(
                eq(spacesTable.id, spaceId),
                eq(teamUserRelationsTable.user, userId),
                eq(teamUserRelationsTable.permission, permission),
            ))
    ).length > 0;
};

export const userCanAccessSpace = (userId: string, spaceId: string) =>
    userHasPermissionForSpace(userId, spaceId, PERMISSION_BASE);
