CREATE TABLE `teamUserRelations` (
    `team` text NOT NULL,
    `user` text NOT NULL,
    `permission` text NOT NULL,
    PRIMARY KEY(`team`, `user`, `permission`),
    FOREIGN KEY (`team`) REFERENCES `teams`(`id`) ON
    UPDATE
        no ACTION ON DELETE no ACTION,
        FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON
    UPDATE
        no ACTION ON DELETE no ACTION
);
--> statement-breakpoint
CREATE TABLE `teams` (
    `id` text PRIMARY KEY NOT NULL,
    `handle` text NOT NULL,
    `displayName` text NOT NULL,
    `description` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tableIdUniqueIndex` ON `teams` (`id`);
--> statement-breakpoint
CREATE UNIQUE INDEX `tableHandleUniqueIndex` ON `teams` (`handle`);
