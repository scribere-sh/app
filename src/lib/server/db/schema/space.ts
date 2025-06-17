import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { teamsTable } from "./teams";

export const spacesTable = sqliteTable(
    "spaces",
    {
        id: text({ mode: "text" })
            .notNull()
            .primaryKey(),

        title: text({ mode: "text" })
            .notNull(),

        team: text({ mode: "text" })
            .notNull()
            .references(() => teamsTable.id),

        createdAt: integer({ mode: "timestamp" })
            .notNull(),

        homepage: text({ mode: "text" })
            .notNull(),
    },
);
