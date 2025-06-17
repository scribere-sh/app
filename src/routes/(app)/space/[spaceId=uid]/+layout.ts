import { api, prefetchQuery } from "$lib/hc";
import type { LayoutLoad } from "./$types"

export const load: LayoutLoad = async ({ params, parent, fetch }) => {
    const { client } = await parent();

    await prefetchQuery({
        client,
        endpoint: api.space[":spaceId"].details,
        input: {
            param: {
                spaceId: params.spaceId
            }
        },
        options: {
            fetch
        }
    });

    return {
        spaceId: params.spaceId
    };
};
