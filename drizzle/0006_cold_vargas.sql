CREATE TABLE `changePasswordChallenges` (
    `id` blob NOT NULL,
    `userId` text NOT NULL,
    `challengeVerifier` blob NOT NULL,
    `emailRef` text NOT NULL,
    `expires` integer NOT NULL,
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON
    UPDATE
        no ACTION ON DELETE no ACTION
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idChangePasswordChallengesTableUniqueIndex` ON `changePasswordChallenges` (`id`);
