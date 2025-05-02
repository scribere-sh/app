CREATE TABLE `emailValidations` (
    `userId` text NOT NULL,
    `email` text NOT NULL,
    `challenge` blob NOT NULL,
    `emailRef` text NOT NULL,
    `expires` integer NOT NULL
);
