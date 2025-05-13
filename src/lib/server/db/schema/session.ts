import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const sessionDetailsTable = sqliteTable(
    "sessionDetails",
    {
        /**
         * Session ID, this is the sha256 hash of the `sid` key of the session token
         */
        sessionId: blob({ mode: "buffer" }).$type<Uint8Array>().notNull(),
        /**
         * User ID, who this token relates to, should be checked
         */
        userIdHash: blob({ mode: "buffer" }).$type<Uint8Array>().notNull(),

        /**
         * when the session was created
         */
        createdAt: integer({ mode: "timestamp" })
            .notNull(),
        /**
         * client ip address of the request that created the session
         */
        ip: text({ mode: "text" })
            .notNull(),
        /**
         * user agent of the request that created the session, can be with
         * with `device-detector-js` to derive the device and brower.
         *
         * nullable since we're not 100% sure we can always get it.
         */
        userAgent: text({ mode: "text" }),
    },
);
