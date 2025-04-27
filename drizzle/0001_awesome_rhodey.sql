DROP INDEX "userIdPasswordTableUniqueIndex";
--> statement-breakpoint
DROP INDEX "userIdTotpSecretTableUniqueIndex";
--> statement-breakpoint
DROP INDEX "userIdIndex";
--> statement-breakpoint
DROP INDEX "emailUniqueIndex";
--> statement-breakpoint
DROP INDEX "emailValidationExpirationIndex";
--> statement-breakpoint
DROP INDEX "emailValidationsUniqueIndex";
--> statement-breakpoint
DROP INDEX "usersHandleUniqueIndex";
--> statement-breakpoint
ALTER TABLE
    `emailOnboardings`
ALTER COLUMN
    "challenge" TO "challenge" blob NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX `userIdPasswordTableUniqueIndex` ON `passwords` (`userId`);
--> statement-breakpoint
CREATE UNIQUE INDEX `userIdTotpSecretTableUniqueIndex` ON `totpSecrets` (`userId`);
--> statement-breakpoint
CREATE INDEX `userIdIndex` ON `emailAddresses` (`userId`);
--> statement-breakpoint
CREATE UNIQUE INDEX `emailUniqueIndex` ON `emailAddresses` (lower(`email`));
--> statement-breakpoint
CREATE INDEX `emailValidationExpirationIndex` ON `emailOnboardings` (`expires`);
--> statement-breakpoint
CREATE UNIQUE INDEX `emailValidationsUniqueIndex` ON `emailOnboardings` (lower(`email`));
--> statement-breakpoint
CREATE UNIQUE INDEX `usersHandleUniqueIndex` ON `users` (`handle`);
--> statement-breakpoint
ALTER TABLE
    `emailOnboardings`
ADD
    `emailRef` text NOT NULL;
