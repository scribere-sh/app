CREATE TABLE `sessionDetails` (
    `sessionId` blob NOT NULL,
    `userIdHash` blob NOT NULL,
    `createdAt` integer NOT NULL,
    `ip` text NOT NULL,
    `userAgent` text
);
