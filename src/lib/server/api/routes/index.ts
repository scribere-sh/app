import { HonoKit } from "../hono-kit";

import { Hono } from "hono";

import AccountRouter from "./account";
import AssetsRouter from "./assets";
import PagesRouter from "./page";
import SpaceRouter from "./space";
import TeamsRouter from "./teams";
import UsersRoutes from "./users";

export default new Hono()
    .use(HonoKit)
    .route("/account", AccountRouter)
    .route("/assets", AssetsRouter)
    .route("/pages", PagesRouter)
    .route("/space", SpaceRouter)
    .route("/teams", TeamsRouter)
    .route("/users", UsersRoutes);
