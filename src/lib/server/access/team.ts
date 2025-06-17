import { and, eq } from "drizzle-orm";

import { db } from "$lib/server/db";
import { teamUserRelationsTable } from "$tb/teams";

import { type Permission, PERMISSION_BASE } from "$lib/schema/permission";

export const userHasPermissionInTeam = async (userId: string, teamId: string, permission: Permission) => {
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

export const userIsMemberOfTeam = (userId: string, teamId: string) =>
    userHasPermissionInTeam(userId, teamId, PERMISSION_BASE);
