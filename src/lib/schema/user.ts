import { type } from "arktype";

export const DisplayName = type("/^[a-zA-Z0-9-_. ]{1,25}$/");

export const Handle = type("/^[a-z][a-z0-9-.]{3,25}$/");

// todo: add more of these

export const User = type({
    displayName: DisplayName,
    handle: Handle,
    id: "string",
});

export type User = typeof User.infer;
