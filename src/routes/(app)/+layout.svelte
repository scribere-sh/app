<script lang="ts">
    import AppSidebar from "$blk/app-sidebar";

    import { QueryClientProvider } from "@tanstack/svelte-query";
    import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";

    let { children, data } = $props();

    const { client, user } = data;
</script>

<SvelteQueryDevtools {client} />

<QueryClientProvider {client}>
    <AppSidebar {user} />

    <main class="pl-sidebar flex min-h-screen w-screen flex-col items-center justify-center gap-8 text-foreground">
        {@render children()}
    </main>
</QueryClientProvider>
