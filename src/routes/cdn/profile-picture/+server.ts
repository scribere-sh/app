import { getUserProfilePicture } from "$srv/r2/profile-picture";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals }) => {
    const r2Response = await getUserProfilePicture(locals.user.id);

    if (!r2Response) return new Response(null, { status: 404 });

    return new Response(await r2Response.arrayBuffer(), {
        status: 200,
        headers: {
            etag: r2Response.etag,
        },
    });
};
