import { type } from "arktype";
import { UidSchema } from "./uid";

export const DisplayName = type("/^[a-zA-Z0-9-_. ]{1,25}$/");

export const Handle = type("/^[a-z][a-z0-9-.]{3,25}$/");

export const User = type({
    displayName: DisplayName,
    handle: Handle,
    id: UidSchema,
});

export type User = typeof User.infer;
