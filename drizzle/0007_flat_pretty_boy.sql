PRAGMA foreign_keys = OFF;
--> statement-breakpoint
CREATE TABLE `__new_sessionDetails` (
    `sessionId` blob NOT NULL,
    `userIdHash` blob NOT NULL,
    `createdAt` integer NOT NULL,
    `ip` text,
    `userAgent` text
);
--> statement-breakpoint
INSERT INTO
    `__new_sessionDetails`(
        "sessionId",
        "userIdHash",
        "createdAt",
        "ip",
        "userAgent"
    )
SELECT
    "sessionId",
    "userIdHash",
    "createdAt",
    "ip",
    "userAgent"
FROM
    `sessionDetails`;
--> statement-breakpoint
DROP TABLE `sessionDetails`;
--> statement-breakpoint
ALTER TABLE
    `__new_sessionDetails` RENAME TO `sessionDetails`;
--> statement-breakpoint
PRAGMA foreign_keys = ON;
