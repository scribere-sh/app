<script lang="ts" module>
    import type { PageData } from "./$types";

    interface SpaceListProps {
        teamId: PageData['teamId']
    }
</script>

<script lang="ts">
    import { api, createQuery } from "$lib/hc";

    import * as Card from "$ui/card";
    
    const {
        teamId
    }: SpaceListProps = $props();

    const spacesQuery = createQuery({
        endpoint: api.teams.getSpaces,
        input: {
            query: {
                team: teamId
            }
        }
    });
</script>

<div class="w-page flex flex-row flex-wrap gap-4">
    {#if $spacesQuery.data}
        {#each $spacesQuery.data as space (space.id)}
            <Card.Space 
                spaceId={space.id}
                spaceName={space.title}
                homePageId={space.homepage}
                pageCount={space.pageCount}
                lastUpdated={new Date(space.createdAt)}
            />
        {/each}
    {:else}
        loading...
    {/if}
</div>
