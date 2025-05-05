import type { LayoutLoad } from "./$types";

import { api, prefetchQuery } from "$lib/hc";
import { QueryClient } from "@tanstack/svelte-query";

import { browser } from "$app/environment";

export const load: LayoutLoad = async (event) => {
    const client = new QueryClient({
        defaultOptions: {
            queries: {
                enabled: browser,
                refetchOnMount: false,
            },
        },
    });

    await prefetchQuery({
        client,
        endpoint: api.users.me,
    });

    return { ...event.data, client };
};
