import { HonoKit } from "../hono-kit";

import { Hono } from "hono";

import AccountRouter from "./account";
import AssetsRouter from "./assets";
import TeamsRouter from "./teams";
import UsersRoutes from "./users";

export default new Hono()
    .use(HonoKit)
    .route("/account", AccountRouter)
    .route("/assets", AssetsRouter)
    .route("/teams", TeamsRouter)
    .route("/users", UsersRoutes);
