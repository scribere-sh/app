import { api, prefetchQuery } from "$lib/hc";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent, data }) => {
    const { client } = await parent();

    await prefetchQuery({
        client,
        endpoint: api.account.details,
    });

    return {
        ...data,
    };
};
