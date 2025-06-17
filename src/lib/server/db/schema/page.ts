import { foreignKey, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { spacesTable } from "./space";

export const pagesTable = sqliteTable(
    "pages",
    {
        id: text({ mode: "text" })
            .notNull()
            .primaryKey(),

        title: text({ mode: "text" })
            .notNull(),

        space: text({ mode: "text" })
            .notNull()
            .references(() => spacesTable.id),

        parent: text({ mode: "text" }),

        lastUpdated: integer({ mode: "timestamp" }),

        content: text({ mode: "json" })
            .$type<object>(),
    },
    (tb) => ({
        parentRefrence: foreignKey({
            columns: [tb.parent],
            foreignColumns: [tb.id],
        }),
    }),
);
