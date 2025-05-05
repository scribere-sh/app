import type { Env } from "../hono-kit";

import { Hono } from "hono";
// import { HTTPException } from "hono/http-exception";

export default new Hono<Env>()
    // # GET /me
    .get("/me", async (c) => {
        return c.json(c.get("user"));
    });
