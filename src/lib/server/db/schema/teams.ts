import {
    primaryKey,
    // blob,
    // integer,
    sqliteTable,
    text,
    uniqueIndex,
} from "drizzle-orm/sqlite-core";

import type { Permission } from "$lib/schema/permission";

import { usersTable } from "./user";

export const teamsTable = sqliteTable(
    "teams",
    {
        /**
         * Unique ID for this team.
         */
        id: text({ mode: "text" })
            .notNull()
            .primaryKey(),

        /**
         * Handle to make mentioning this team easier.
         *
         * Must be unique between {@link usersTable | `usersTable`}'s handles
         */
        handle: text({ mode: "text" })
            .notNull(),

        /**
         * Display name for this team.
         */
        displayName: text({ mode: "text" })
            .notNull(),

        /**
         * Rich text output for the description of this.
         */
        description: text({ mode: "json" })
            .notNull(),
    },
    (table) => [
        /**
         * Unique Table IDs
         */
        uniqueIndex("tableIdUniqueIndex").on(table.id),
        /**
         * Unique Table Handles
         */
        uniqueIndex("tableHandleUniqueIndex").on(table.handle),
    ],
);

/**
 * This can be thought of as a graph edge (or relationship / relation) where the {@link teamsTable | `teamsTable`}
 * and the {@link usersTable | `usersTable` } are the nodes.
 *
 * There may be multple edges between an individual user and team in order to define permissions.
 *
 * The combination of teams, users and permissions however must be unique, hense the inclusion of a
 * composite public key.
 *
 * This implementation is loosely inspired by OpenFGA's ideology and we can continue to call our system
 * ABAC based because these relations are *technically* attributes.
 *
 * @see https://openfga.dev/docs/concepts#what-is-a-relation
 */
export const teamUserRelationsTable = sqliteTable(
    "teamUserRelations",
    {
        /**
         * ID of the team this relation points to
         */
        team: text({ mode: "text" })
            .notNull()
            .references(() => teamsTable.id),
        /**
         * ID of the user this relation points to
         */
        user: text({ mode: "text" })
            .notNull()
            .references(() => usersTable.id),

        /**
         * Permission represented by this relation
         *
         * You need to add the permission as a constant in the permissions file.
         *
         * in `src/lib/schema/permission.ts`.
         */
        permission: text({ mode: "text" })
            .$type<Permission>()
            .notNull(),
    },
    (table) => [
        primaryKey({
            name: "teamUserRelationsAndPermissionsPrimaryKeyIndex",
            columns: [
                table.team,
                table.user,
                table.permission,
            ],
        }),
    ],
);
