import { type } from "arktype";

export const User = type({
    displayName: "string",
    handle: "string",
    id: "string",
});

export type User = typeof User.infer;
