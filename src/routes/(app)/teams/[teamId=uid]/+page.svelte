<script lang="ts">
    import type { PageProps } from "./$types";

    import { Skeleton } from "$ui/skeleton";

    import { api, createQuery } from '$lib/hc';

    const {
        data
    }: PageProps = $props();
    
    const teamQuery = createQuery({
        endpoint: api.teams.getTeamDetails,
        input: {
            query: {
                team: data.teamId
            }
        }
    })
</script>

{#if $teamQuery.data}
    {@const data = 
        // @ts-expect-error - useless bloody language i tell ya 
        $teamQuery.data
    }
    <pre>{JSON.stringify(data, null, 2)}</pre>
{/if}

<div class="w-page flex flex-col items-start justify-center gap-2">
    {#if $teamQuery.isSuccess}
        <h1 class="text-4xl w-full font-bold">{$teamQuery.data.displayName}</h1>
        <h2 class="text-2xl w-full opacity-65">@{$teamQuery.data.handle}</h2>
    {:else}
        <Skeleton class="w-2/3 h-9 mt-[--spacing(calc(2/2.5))]" />
        <Skeleton class="w-1/2 h-6 mt-[--spacing(calc(2/1.5))]" />
    {/if}
</div>

