import { getRequestEvent } from "$app/server";

import type { Session } from "$lib/schema/session";
import type { User } from "$lib/schema/user";

import { createMiddleware } from "hono/factory";

type InjectedVariables = {
    user: User;
    session: Session;
    token: string;
};

export type Env = {
    Bindings: App.Platform["env"];
    Variables: InjectedVariables;
};

export const HonoKit = createMiddleware<Env>(async (c, next) => {
    const { locals, platform } = getRequestEvent();
    if (!platform) throw new Error("unable to access platform apis");

    c.set("user", locals.user);
    c.set("session", locals.session);
    c.set("token", locals.token);

    c.env = platform.env;

    await next();
});
