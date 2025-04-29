import type { PageServerLoad } from "./$types";

import { redirect } from "@sveltejs/kit";

import { TOKEN_COOKIE_NAME } from "$srv/auth/cookie";
import { deleteSession } from "$srv/auth/session";

import { route } from "$lib/routes";

export const load: PageServerLoad = async ({ locals: { session }, cookies }) => {
    // If the user attempts to hit this endpoint with an invalid or non-existent token
    // session (in spite of the types) will be undefined
    //
    // so we should do this check
    if (session) {
        await deleteSession(session.raw);
    }

    cookies.delete(TOKEN_COOKIE_NAME, { path: "/" });

    redirect(303, route("/auth/sign-in"));
};
