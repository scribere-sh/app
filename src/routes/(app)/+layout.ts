import type { LayoutLoad } from "./$types";

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

    return { ...event.data, client };
};
