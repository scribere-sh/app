import { t } from "elysia";

export const User = t.Object({
    displayName: t.String(),
    handle: t.String(),
    id: t.String(),
});

export type User = typeof User.static;
