<script lang="ts">
    import { dev } from "$app/environment";

    import AppSidebar from "$blk/app-sidebar";

    import { setLayoutContext } from "$lib/ctx.js";

    import { QueryClientProvider } from "@tanstack/svelte-query";
    import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";

    let { children, data } = $props();

    const { client } = data;

    setLayoutContext(data);
</script>

{#if dev}
    <SvelteQueryDevtools {client} />
{/if}

<QueryClientProvider {client}>
    <AppSidebar />

    <main class="pl-sidebar min-h-screen w-screen flex flex-col items-center justify-start gap-12 pt-content-top text-foreground">
        {@render children()}
    </main>
</QueryClientProvider>
