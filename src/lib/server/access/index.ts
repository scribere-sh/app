import { HTTPException } from "hono/http-exception";

export * as team from "./team";

// export const accessControl = <E extends Env, P extends string, I extends Input>(
//     checks: (c: Context<E, P, I>) => Promise<boolean> | boolean,
//     failureMessage: string = "Access Denied",
// ) => createMiddleware<E, P, I>(async (c, next) => {
//     if (!await checks(c)) {
//         throw new HTTPException(401, { message: failureMessage });
//     }

//     await next();
// });

export const accessControl = async (...checks: (() => Promise<boolean> | boolean)[]) => {
    for (const check of checks) {
        if (!(await check())) {
            throw new HTTPException(401, { message: "Access Denied" });
        }
    }
};
