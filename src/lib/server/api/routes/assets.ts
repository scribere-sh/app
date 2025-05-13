import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Env } from "../hono-kit";

import { getUserProfilePicture } from "$srv/r2/profile-picture";

export default new Hono<Env>()
    .get("/profile-picture/me", async (c) => {
        const profilePicture = await getUserProfilePicture(c.get("user").id);

        if (!profilePicture) throw new HTTPException(404, { message: "no profile picture for user" });

        c.header("ETag", profilePicture.etag);

        if (profilePicture.httpMetadata) {
            c.header("Content-Type", profilePicture.httpMetadata.contentType);
            c.header("Content-Encoding", profilePicture.httpMetadata.contentEncoding);
        }

        return c.body(await profilePicture.arrayBuffer());
    })
    .get("/profile-picture/:user-id", async (c) => {
        const userId = c.req.param("user-id");

        const profilePicture = await getUserProfilePicture(userId);

        if (!profilePicture) throw new HTTPException(404, { message: "no profile picture for user" });

        c.header("ETag", profilePicture.etag);

        if (profilePicture.httpMetadata) {
            c.header("Content-Type", profilePicture.httpMetadata.contentType);
            c.header("Content-Encoding", profilePicture.httpMetadata.contentEncoding);
        }

        return c.body(await profilePicture.arrayBuffer());
    });
