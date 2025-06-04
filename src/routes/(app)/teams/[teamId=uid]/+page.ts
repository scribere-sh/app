import type { PageLoad } from "./$types";

import { api, prefetchQuery } from "$lib/hc";

export const load: PageLoad = async (event) => {
    const { client } = await event.parent();

    await prefetchQuery({
        client,
        endpoint: api.teams.getTeamDetails,
        input: {
            query: {
                team: event.params.teamId,
            },
        },
        options: {
            fetch: event.fetch,
        },
    });

    return {
        // note: if server data gets loaded here, uncomment this or no data will be given to the component.
        // ...event.data,
        teamId: event.params.teamId,
    };
};
