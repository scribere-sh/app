import type { PageLoad } from "./$types";

import { api, prefetchQuery } from "$lib/hc";

export const load: PageLoad = async ({ params, parent, fetch, data }) => {
    const { client } = await parent();

    await prefetchQuery({
        client,
        endpoint: api.pages[':pageId'].content,
        input: {
            param: {
                pageId: params.pageId
            }
        },
        options: {
            fetch
        }
    });

    return {
        ...data,
        pageId: params.pageId
    }
};
