import { getRequestEvent } from "$app/server";

import type { Session } from "$lib/schema/session";
import type { User } from "$lib/schema/user";

import { createMiddleware } from "hono/factory";

type InjectedVariables = {
    user: User;
    session: Session;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type InjectedBindings = {};

export const HonoKit = createMiddleware<{
    Bindings: InjectedBindings;
    Variables: InjectedVariables;
}>(async (c, next) => {
    const { locals } = getRequestEvent();

    c.set("user", locals.user);
    c.set("session", locals.session);

    await next();
});
