import type { LayoutLoad } from "./$types";

import { httpLink } from "@ap0nia/eden-svelte-query";
import { QueryClient } from "@tanstack/svelte-query";

import { browser } from "$app/environment";
import { eden } from "$lib/eden";

export const load: LayoutLoad = async (event) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                enabled: browser,
                refetchOnMount: false,
            },
        },
    });

    const client = eden.createClient({
        links: [
            // @ts-expect-error for some stupid ass reason typescript is shitting itself
            httpLink({
                fetcher: event.fetch,
            }),
        ],
    });

    return { ...event.data, client, queryClient };
};
