PRAGMA foreign_keys = OFF;
--> statement-breakpoint
CREATE TABLE `__new_emailOnboardings` (
    `email` text NOT NULL,
    `challenge` blob NOT NULL,
    `emailRef` text NOT NULL,
    `expires` integer
);
--> statement-breakpoint
INSERT INTO
    `__new_emailOnboardings`("email", "challenge", "emailRef", "expires")
SELECT
    "email",
    "challenge",
    "emailRef",
    "expires"
FROM
    `emailOnboardings`;
--> statement-breakpoint
DROP TABLE `emailOnboardings`;
--> statement-breakpoint
ALTER TABLE
    `__new_emailOnboardings` RENAME TO `emailOnboardings`;
--> statement-breakpoint
PRAGMA foreign_keys = ON;
--> statement-breakpoint
CREATE INDEX `emailValidationExpirationIndex` ON `emailOnboardings` (`expires`);
--> statement-breakpoint
CREATE UNIQUE INDEX `emailValidationsUniqueIndex` ON `emailOnboardings` (lower(`email`));
