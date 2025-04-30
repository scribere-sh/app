import { HonoKit } from "../hono-kit";

import { Hono } from "hono";
// import { HTTPException } from "hono/http-exception";

export default new Hono()
    .use(HonoKit)
    .get("/me", (c) => {
        return c.json(c.get("user"));
    });
