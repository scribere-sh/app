import { api, prefetchQuery } from "$lib/hc";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent, fetch }) => {
    const { client } = await parent();

    await prefetchQuery({
        client,
        endpoint: api.account.details,
        options: {
            fetch,
        },
    });
};
