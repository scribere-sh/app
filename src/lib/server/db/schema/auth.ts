import {
    blob,
    primaryKey,
    sqliteTable,
    // integer,
    text,
    uniqueIndex,
} from "drizzle-orm/sqlite-core";

import { usersTable } from "./user";

/**
 * # Passwords
 *
 * Direct password authentication will be stored here, other
 * forms of authentication have other tables for their requirements.
 *
 * If you think having several tables for this is complex, you are 100%
 * correct. I don't care.
 */
export const passwordsTable = sqliteTable(
    "passwords",
    {
        /**
         * The user that this password authenticates, a user may only
         * have one password.
         *
         * As such, this is unique and has a {@link uniqueIndex}.
         *
         * There's no real point in storing a hash since if an attacker
         * gets this they'll probably have the orignals from the
         * {@link usersTable} as well.
         *
         * @see {@link usersTable.id}
         */
        userId: text({ mode: "text" })
            .notNull()
            .references(() => usersTable.id, {
                onDelete: "cascade",
            }),

        /**
         * The `argon2` hash of the password.
         */
        hash: text({ mode: "text" }).notNull(),
    },
    (table) => [
        /**
         * Unique Index for the userID within this table, we
         * will not be looking up by hash because that's a
         * stupid idea.
         */
        uniqueIndex("userIdPasswordTableUniqueIndex").on(table.userId),
    ],
);

/**
 * # TOTP Secrets
 *
 * Storage of secrets of **T**ime-Based **O**ne **T**ime **P**asswords.
 */
export const totpSecretsTable = sqliteTable(
    "totpSecrets",
    {
        /**
         * The user that this password authenticates, a user may only
         * have one password.
         *
         * As such, this is unique and has a {@link uniqueIndex}.
         *
         * There's no real point in storing a hash since if an attacker
         * gets this they'll probably have the orignals from the
         * {@link usersTable} as well.
         */
        userId: text({ mode: "text" })
            .notNull()
            .references(() => usersTable.id, {
                onDelete: "cascade",
            }),

        /**
         * totp secret
         *
         * I can't think of a better way to do this that meets our
         * requirements as encryption is pretty much out of the
         * question here since we need to fetch it quickly and
         * easily to check the codes.
         */
        secret: blob({ mode: "buffer" }).$type<Uint8Array>().notNull(),

        /**
         * Recovery Key `argon2` hash.
         *
         * This is to be treated like a 2nd password because that's
         * what pretty much it is.
         */
        recoveryKey: text({ mode: "text" }).notNull(),
    },
    (table) => [
        /**
         * Unique Index for the userID within this table, we
         * will not be looking up by hash because that's a
         * stupid idea.
         */
        uniqueIndex("userIdTotpSecretTableUniqueIndex").on(table.userId),
    ],
);

/**
 * # OAuth2 Providers
 */
export const oauthProvidersTable = sqliteTable(
    "oauthProviders",
    {
        /**
         * The user that this provider links to
         *
         * @see {@link usersTable.id}
         */
        userId: text({ mode: "text" })
            .notNull()
            .references(() => usersTable.id, {
                onDelete: "cascade",
            }),

        provider: text({ mode: "text" }).notNull(),

        providerUserId: text({ mode: "text" }).notNull(),
    },
    (table) => [
        /**
         * This table makes use of a composite primary key,
         * where the uniqueness is determined by the combination
         * of the 2 columns being unique.
         *
         * This means that a user may appear multiple times, but
         * for each user only 1 row for each provider may exist.
         *
         * @see {@link https://orm.drizzle.team/docs/indexes-constraints#composite-primary-key}
         *
         * ```sql
         * CREATE TABLE test (
         * 	value1 text not null,
         *  value2 text not null,
         *  value3 text not null,
         *  PRIMARY KEY (value1, value2)
         * );
         *
         * INSERT INTO test (value1, value2, value3) VALUES ('a', 'b', 'c'); -- OK
         * INSERT INTO test (value1, value2, value3) VALUES ('a', 'd', 'c'); -- OK
         * INSERT INTO test (value1, value2, value3) VALUES ('a', 'b', 'd'); -- ERROR
         * ```
         */
        primaryKey({ name: "composite", columns: [table.userId, table.provider] }),
    ],
);
