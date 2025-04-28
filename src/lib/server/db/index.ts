import { getRequestEvent } from "$app/server";
import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";

export const db = (): DrizzleD1Database => {
    const { platform, locals } = getRequestEvent();

    if ("__db" in locals === false) {
        console.debug("accessing platform API DB");
        if (!platform) throw new Error("unable to access platform APIs");
        // @ts-expect-error i know it's not defined there i don't want to put it in the app config
        locals["__db"] = drizzle(platform.env.DB);
    }

    // @ts-expect-error see above
    return locals["__db"];
};
