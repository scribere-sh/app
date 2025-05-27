import type { PageLoad } from "./$types";

import { api, prefetchQuery } from "$lib/hc";

export const load: PageLoad = async (event) => {
    const { client } = await event.parent();

    await prefetchQuery({
        client,
        endpoint: api.teams.getUserTeams,
        options: {
            fetch: event.fetch,
        },
    });
};
