CREATE TABLE `oauthProviders` (
    `userId` text NOT NULL,
    `provider` text NOT NULL,
    `providerUserId` text NOT NULL,
    PRIMARY KEY(`userId`, `provider`),
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON
    UPDATE
        no ACTION ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `passwords` (
    `userId` text NOT NULL,
    `hash` text NOT NULL,
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON
    UPDATE
        no ACTION ON DELETE CASCADE
);
--> statement-breakpoint
CREATE UNIQUE INDEX `userIdPasswordTableUniqueIndex` ON `passwords` (`userId`);
--> statement-breakpoint
CREATE TABLE `totpSecrets` (
    `userId` text NOT NULL,
    `secret` blob NOT NULL,
    `recoveryKey` text NOT NULL,
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON
    UPDATE
        no ACTION ON DELETE CASCADE
);
--> statement-breakpoint
CREATE UNIQUE INDEX `userIdTotpSecretTableUniqueIndex` ON `totpSecrets` (`userId`);
--> statement-breakpoint
CREATE TABLE `emailAddresses` (
    `userId` text NOT NULL,
    `email` text NOT NULL,
    `isVerified` integer,
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON
    UPDATE
        no ACTION ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX `userIdIndex` ON `emailAddresses` (`userId`);
--> statement-breakpoint
CREATE UNIQUE INDEX `emailUniqueIndex` ON `emailAddresses` (lower("email"));
--> statement-breakpoint
CREATE TABLE `emailOnboardings` (
    `email` text NOT NULL,
    `challenge` text NOT NULL,
    `expires` integer,
    FOREIGN KEY (`email`) REFERENCES `emailAddresses`(`email`) ON
    UPDATE
        no ACTION ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX `emailValidationExpirationIndex` ON `emailOnboardings` (`expires`);
--> statement-breakpoint
CREATE UNIQUE INDEX `emailValidationsUniqueIndex` ON `emailOnboardings` (lower("email"));
--> statement-breakpoint
CREATE TABLE `users` (
    `id` text PRIMARY KEY NOT NULL,
    `handle` text NOT NULL,
    `displayName` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `usersHandleUniqueIndex` ON `users` (`handle`);
