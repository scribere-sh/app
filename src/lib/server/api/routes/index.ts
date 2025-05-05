import { HonoKit } from "../hono-kit";

import { Hono } from "hono";

import AccountRouter from "./account";
import UsersRoutes from "./users";

export default new Hono()
    .use(HonoKit)
    .route("/users", UsersRoutes)
    .route("/account", AccountRouter);
