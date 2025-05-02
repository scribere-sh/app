import type { Env } from "../hono-kit";

import { Hono } from "hono";
// import { HTTPException } from "hono/http-exception";

export default new Hono<Env>()
    // # GET /me
    .get("/me", async (c) => {
        await new Promise(res => setTimeout(res, 2000));
        return c.json(c.get("user"));
    });
