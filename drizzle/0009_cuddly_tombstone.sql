CREATE TABLE `pages` (
    `id` text PRIMARY KEY NOT NULL,
    `title` text NOT NULL,
    `space` text NOT NULL,
    `parent` text,
    `lastUpdated` integer,
    `content` text,
    FOREIGN KEY (`space`) REFERENCES `spaces`(`id`) ON
    UPDATE
        no ACTION ON DELETE no ACTION,
        FOREIGN KEY (`parent`) REFERENCES `pages`(`id`) ON
    UPDATE
        no ACTION ON DELETE no ACTION
);
--> statement-breakpoint
CREATE TABLE `spaces` (
    `id` text PRIMARY KEY NOT NULL,
    `title` text NOT NULL,
    `team` text NOT NULL,
    `createdAt` integer NOT NULL,
    `homepage` text NOT NULL,
    FOREIGN KEY (`team`) REFERENCES `teams`(`id`) ON
    UPDATE
        no ACTION ON DELETE no ACTION
);
