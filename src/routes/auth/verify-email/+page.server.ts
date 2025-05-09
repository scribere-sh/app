import type { PageServerLoad } from "./$types";

import { redirect } from "@sveltejs/kit";

import { route } from "$lib/routes";

export const load: PageServerLoad = () => {
    // at the end redirect home.
    redirect(303, route("/"));
};
