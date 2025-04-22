import type { LayoutLoad } from './$types';

import { httpLink } from '@ap0nia/eden-svelte-query';
import { QueryClient } from '@tanstack/svelte-query';

import { createClient } from '$lib/eden';
import { browser } from '$app/environment';

export const load: LayoutLoad = async (event) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				refetchOnMount: false
			}
		}
	});

	const client = createClient({
		links: [
			// @ts-expect-error for some stupid ass reason typescript is shitting itself
			httpLink({
				fetcher: event.fetch
			})
		]
	});

	return { client, queryClient, dehydrated: event.data.dehydrated };
};
