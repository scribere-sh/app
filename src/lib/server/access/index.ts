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

// this mf isn't running the checks

export const accessControl = async (...checks: (() => Promise<boolean> | boolean)[]) => {
    console.log(checks);

    for (const check of checks) {
        console.log("running access control check");
        if (!(await check())) {
            console.log("access control failed");
            throw new HTTPException(401, { message: "Access Denied" });
        }
    }
};
