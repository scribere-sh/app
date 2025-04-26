import { ulid } from "../../ulid";

import {
    sqliteTable,
    // integer,
    text,
    uniqueIndex,
    // blob
} from "drizzle-orm/sqlite-core";

/**
 * # User
 *
 * The main users table, the user themselves shall be stored here.
 */
export const usersTable = sqliteTable(
    "users",
    {
        /**
         * The primary identifier for a user comes in the form of a
         * {@link https://github.com/ulid/spec | `ulid`}.
         */
        id: text({ mode: "text" })
            .notNull()
            .primaryKey()
            .$defaultFn(() => ulid().toCanonical()),

        /**
         * Handle for the user, allows for quick mentioning, must
         * be unique for an instance (or in this case globally).
         *
         * @see {@link https://later.com/social-media-glossary/social-media-handle/}
         */
        handle: text({ mode: "text" }).notNull(),

        /** */
        displayName: text({ mode: "text" }).notNull(),
    },
    (table) => [
        /**
         * make handles unique
         */
        uniqueIndex("usersHandleUniqueIndex").on(table.handle),
    ],
);
