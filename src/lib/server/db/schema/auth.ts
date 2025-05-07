import type { ProviderName } from "$srv/oauth/providers";

import { blob, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

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
         * whether or not OTP is in use for this user, if it's not the
         * otp will not be applied to the user as we haven't confirmed
         * that the secret is valid and that the user has a code generator
         * set up.
         */
        inUse: integer({ mode: "boolean" }).notNull().$default(() => false),

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

        /**
         * Provider Name
         *
         * this should be lower case and plain & simple
         * for GitHub this will simply be the string "github"
         */
        provider: text({ mode: "text" }).notNull().$type<ProviderName>(),

        /**
         * Provider User ID
         *
         * this should be the hash of the UserID provided by the
         * external provider.
         *
         * Todo: we still need to decide if OAuth should skip MFA.
         */
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

export const changePasswordChallengesTable = sqliteTable(
    "changePasswordChallenges",
    {
        /**
         * Change ID Request ID, this is a hash of the one sent to the user.
         */
        id: blob({ mode: "buffer" })
            .$type<Uint8Array>()
            .notNull(),

        /**
         * User ID that this challenge references
         */
        userId: text({ mode: "text" })
            .notNull()
            .references(() => usersTable.id),

        /**
         * Challenge verifier, this is the hash of the challenge sent to the user
         */
        challengeVerifier: blob({ mode: "buffer" })
            .$type<Uint8Array>()
            .notNull(),

        /**
         * Once the email is sent, the ref will be placed in here for debugging
         */
        emailRef: text({ mode: "text" })
            .notNull(),

        /**
         * Expiry date of the challenge, if the challenge is found but is expired,
         * it should be considered invalid.
         */
        expires: integer({ mode: "timestamp" })
            .notNull(),
    },
    (table) => [
        uniqueIndex("idChangePasswordChallengesTableUniqueIndex").on(table.id),
    ],
);
