import { type SQL, sql } from "drizzle-orm";
import { type AnySQLiteColumn, blob, index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import { usersTable } from "./user";

/**
 * # Emails
 *
 * Storage and relation of email addresses.
 *
 * To look this up, ensure you wrap the reference to this
 * table with {@link emailLowerCase}.
 *
 * @see {@link https://orm.drizzle.team/docs/guides/unique-case-insensitive-email#sqlite}
 */
export const emailAddressesTable = sqliteTable(
    "emailAddresses",
    {
        /**
         * the user that this entry relates to, may not be unique as users
         * may have multiple email addresses.
         *
         * @see {@link usersTable.id}
         */
        userId: text({ mode: "text" })
            .notNull()
            .references(() => usersTable.id, {
                onDelete: "cascade",
            }),

        /**
         * The email address
         *
         * To look this up, ensure you wrap the reference to this
         * column with {@link emailLowerCase}.
         *
         * @see {@link https://orm.drizzle.team/docs/guides/unique-case-insensitive-email#sqlite}
         */
        email: text({ mode: "text" }).notNull(),

        /**
         * Whether or not the email address is verified.
         */
        isVerified: integer({ mode: "boolean" }).$default(() => false),
    },
    (table) => [
        /**
         * Add an index to the table to allow faster lookups by userid.
         */
        index("userIdIndex").on(table.userId),
        /**
         * Enforce that the email addresses in this table be unique
         * in a way that is case insensitive.
         */
        uniqueIndex("emailUniqueIndex").on(emailLowerCase(table.email)),
    ],
);

/**
 * # Email Onboardins
 *
 * stores refs and challenges for validating an email address and creating a new account
 */
export const emailOnboardingsTable = sqliteTable(
    "emailOnboardings",
    {
        /**
         * the email address
         *
         * to look this up, ensure you wrap the reference to this
         * column with {@link emailLowerCase}.
         *
         * @see {@link https://orm.drizzle.team/docs/guides/unique-case-insensitive-email#sqlite}
         * @see {@link usersTable.id}
         */
        email: text({ mode: "text" })
            .notNull(),

        /**
         * This should be some form of verifiable fingerprint of a
         * token that is sent to the users' email address.*:
         *
         * going full `argon2` here may be a bit overkill, a simple
         * salted hash may do the trick.
         */
        challenge: blob({ mode: "buffer" }).$type<Uint8Array>().notNull(),

        /**
         * Resend ID for the sent onboarding email
         */
        emailRef: text({ mode: "text" }).notNull(),

        /**
         * The expiry date of this validation challenge, the expiry
         * time should be given to the user as well and enforced.
         */
        expires: integer({ mode: "timestamp" }).notNull(),
    },
    (table) => [
        /**
         * Allows slightly faster lookup by expiry time, good for
         * purging expired challenges.
         */
        index("emailValidationExpirationIndex").on(table.expires),
        /**
         * enforce that the email addresses in this table be unique
         * in a way that is case insensitive
         */
        uniqueIndex("emailValidationsUniqueIndex").on(emailLowerCase(table.email)),
    ],
);

/**
 * # Email Validations
 *
 * not to be confused with email onboardings, this is for when
 * a user wants to change their email address.
 */
export const emailValidationsTable = sqliteTable(
    "emailValidations",
    {
        /**
         * User ID who is changing their email address
         */
        userId: text({ mode: "text" })
            .notNull(),

        /**
         * the email address
         *
         * to look this up, ensure you wrap the reference to this
         * column with {@link emailLowerCase}.
         *
         * @see {@link https://orm.drizzle.team/docs/guides/unique-case-insensitive-email#sqlite}
         * @see {@link usersTable.id}
         */
        email: text({ mode: "text" })
            .notNull(),

        /**
         * This should be some form of verifiable fingerprint of a
         * token that is sent to the users' email address.*:
         *
         * going full `argon2` here may be a bit overkill, a simple
         * salted hash may do the trick.
         */
        challenge: blob({ mode: "buffer" }).$type<Uint8Array>().notNull(),

        /**
         * Resend ID for the sent change email email
         */
        emailRef: text({ mode: "text" }).notNull(),

        /**
         * The expiry date of this validation challenge, the expiry
         * time should be given to the user as well and enforced.
         */
        expires: integer({ mode: "timestamp" }).notNull(),
    },
);

/**
 * Enabled making a lowercase column
 *
 * @param email - a reference to an SQLite Column that we want to treat as case insensitive
 * @returns an SQL statement that will make said column lowercase
 */
export const emailLowerCase = (email: AnySQLiteColumn): SQL => {
    return sql`lower(${email})`;
};
