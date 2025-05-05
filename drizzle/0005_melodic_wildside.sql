PRAGMA foreign_keys = OFF;
--> statement-breakpoint
CREATE TABLE `__new_totpSecrets` (
    `userId` text NOT NULL,
    `secret` blob NOT NULL,
    `inUse` integer NOT NULL,
    `recoveryKey` text NOT NULL,
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON
    UPDATE
        no ACTION ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO
    `__new_totpSecrets`("userId", "secret", "inUse", "recoveryKey")
SELECT
    "userId",
    "secret",
    "inUse",
    "recoveryKey"
FROM
    `totpSecrets`;
--> statement-breakpoint
DROP TABLE `totpSecrets`;
--> statement-breakpoint
ALTER TABLE
    `__new_totpSecrets` RENAME TO `totpSecrets`;
--> statement-breakpoint
PRAGMA foreign_keys = ON;
--> statement-breakpoint
CREATE UNIQUE INDEX `userIdTotpSecretTableUniqueIndex` ON `totpSecrets` (`userId`);
