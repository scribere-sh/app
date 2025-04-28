import { getRequestEvent } from "$app/server";
import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";

const DB_LOCALS_KEY = "__db";

/**
 * in order to get around the bundle doing weirdness and the fact
 * that the event.platform object contains our DB
 */
export const db = {
    get get(): DrizzleD1Database {
        const { platform, locals } = getRequestEvent();

        if (!(DB_LOCALS_KEY in locals)) {
            console.debug("accessing platform API DB");
            if (!platform) throw new Error("unable to access platform APIs");
            console.time("drizzle-init");
            // @ts-expect-error i know it's not defined that's why I'm defining it
            // this is the closes i'm getting to private object members
            locals[DB_LOCALS_KEY] = drizzle(platform.env.DB);
            console.timeEnd("drizzle-init");
        }

        // @ts-expect-error see above
        return locals[DB_LOCALS_KEY];
    },
};
