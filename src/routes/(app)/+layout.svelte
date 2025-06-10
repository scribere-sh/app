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

    <main class="bg-transparent h-screen z-10 overflow-y-auto min-h-screen w-screen pl-sidebar justify-start gap-12 pt-content-top text-foreground">
        <Swirl class="fixed inset-0 z-0 mt-30 pointer-events-none" />

        <div class="relative z-10 mx-60">
            {@render children()}
        </div>
    </main>
</QueryClientProvider>

<style>
    :global(main *:not(svg)) {
        z-index: 2;
    }
</style>
