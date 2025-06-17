import type { PageLoad } from "./$types";

import { api, prefetchQuery } from "$lib/hc";

export const load: PageLoad = async (event) => {
    const { teamId } = event.params;
    const { client } = await event.parent();

    await Promise.all([
        prefetchQuery({
            client,
            endpoint: api.teams.getTeamDetails,
            input: {
                query: {
                    team: teamId,
                },
            },
            options: {
                fetch: event.fetch,
            },
        }),
        prefetchQuery({
            client,
            endpoint: api.teams.getSpaces,
            input: {
                query: {
                    team: teamId
                }
            },
            options: {
                fetch: event.fetch
            }
        })
    ]);

    return {
        ...event.data,
        teamId: event.params.teamId,
    };
};
