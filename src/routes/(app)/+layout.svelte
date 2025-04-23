<script lang="ts">
	import AppSidebar from '$blk/app-sidebar';

	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';

	import { setContext as setEdenContext } from '$lib/eden';

	let { children, data } = $props();

	const { client, queryClient } = data;

	setEdenContext({
		client,
		queryClient
	});
</script>

<SvelteQueryDevtools client={queryClient} />

<AppSidebar />

<main class="pl-sidebar flex min-h-screen w-screen flex-col items-center justify-center gap-8">
	{@render children()}
</main>
