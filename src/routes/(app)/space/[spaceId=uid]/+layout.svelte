<script lang="ts">
    import type { LayoutProps } from "./$types";

    import { api, createQuery } from "$lib/hc";

    import { Skeleton } from "$ui/skeleton";
    import { Separator } from "$ui/separator";

    import { cn } from "$lib/utils";
    import { route } from "$lib/routes";

    interface SidebarItem {
        id: string;
        title: string;
        children?: SidebarItem[]
    }

    const {
        data,
        children
    }: LayoutProps = $props();

    let sidebarOpen = $state(true);
    
    const spaceDetailsQuery = createQuery({
        endpoint: api.space[":spaceId"].details,
        input: {
            param: {
                spaceId: data.spaceId
            }
        },
    });
</script>

{#snippet sidebarItem(item: SidebarItem, level?: number)}
    <a 
        href={route('/space/[spaceId=uid]/page/[pageId=uid]', { spaceId: data.spaceId, pageId: item.id })}
        style:margin-left={(level ?? 0 * 30) + 'px'}
    >
        {item.title}
    </a>
    {#if item.children && item.children.length > 0}
        {#each item.children as child (child.id)}
            {@render sidebarItem(child, (level ?? 0) + 1)}
        {/each}
    {/if}
{/snippet}

<aside class={cn(
    "w-80 h-screen overflow-hidden fixed top-0 transition-transform bg-[#354350] border-r-primary/50 border-r",
    sidebarOpen ? "left-sidebar" : "-left-sidebar"
)}>
    <h1 class="text-2xl overflow-ellipsis overflow-hidden mx-6 mt-6">
        {#if $spaceDetailsQuery.data}
            <a 
                href={route("/teams/[teamId=uid]", {teamId: $spaceDetailsQuery.data.team })}
                class="no-underline"
            >
                {$spaceDetailsQuery.data.title}
            </a>
        {:else}
            <Skeleton class="w-full h-8" />
        {/if}
    </h1>

    <Separator orientation="horizontal" class="w-full my-4" />

    <!-- Pages -->
    <div class="mx-6 pt-6 flex flex-col">
        {#if $spaceDetailsQuery.data}
            {@render sidebarItem($spaceDetailsQuery.data.homepage)}
            {#each $spaceDetailsQuery.data.rootPages as page (page.id)}
                {@render sidebarItem(page)}
            {/each}
        {:else}
            loading...
        {/if}
    </div>
</aside>

<div class="ml-80 w-[calc(100%-var(--spacing-sidebar)-_--spacing(120))] min-h-screen flex flex-row">
    <div class="w-full">
        {@render children()}
    </div>
</div>

