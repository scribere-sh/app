<script lang="ts">
    import { dev } from "$app/environment";

    import AppSidebar from "$blk/app-sidebar";

    import { QueryClientProvider } from "@tanstack/svelte-query";
    import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";

    let { children, data } = $props();

    const { client, user } = data;
</script>

{#if dev}
    <SvelteQueryDevtools {client} />
{/if}

<QueryClientProvider {client}>
    <AppSidebar {user} />

    <main class="pl-sidebar min-h-screen w-screen flex flex-col items-center justify-start gap-12 pt-content-top">
        {@render children()}
    </main>
</QueryClientProvider>
