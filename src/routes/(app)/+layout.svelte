<script lang="ts">
    import AppSidebar from "$blk/app-sidebar";

    import { hydrate } from "@tanstack/svelte-query";
    import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";

    import { eden } from "$lib/eden";

    let { children, data } = $props();

    const { client, queryClient, user, dehydrated } = data;

    eden.setContext({
        client,
        // @ts-expect-error I don't even know man
        queryClient,
    });

    hydrate(queryClient, dehydrated);
</script>

<SvelteQueryDevtools client={queryClient} />

<AppSidebar {user} />

<main class="pl-sidebar flex min-h-screen w-screen flex-col items-center justify-center gap-8">
    {@render children()}
</main>
