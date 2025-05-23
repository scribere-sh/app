<script lang="ts">
    import { dev } from "$app/environment";

    import AppSidebar from "$blk/app-sidebar";

    import { setLayoutContext } from "$lib/ctx.js";

    import { Swirl } from "$ui/backgrounds";

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

    <main class="[background:var(--app-background)] min-h-screen w-screen pl-sidebar flex flex-col items-center justify-start gap-12 pt-content-top text-foreground">
        <Swirl class="z-0" />

        {@render children()}
    </main>
</QueryClientProvider>

<style>
    :global(main *:not(svg)) {
        z-index: 2;
    }
</style>
