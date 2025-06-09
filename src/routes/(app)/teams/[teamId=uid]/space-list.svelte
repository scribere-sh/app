<script lang="ts" module>
    import type { PageData } from "./$types";

    interface SpaceListProps {
        teamId: PageData['teamId']
    }
</script>

<script lang="ts">
    import { api, createQuery } from "$lib/hc";

    import BookOpen from "@lucide/svelte/icons/book-open";
    import ClockPlus from "@lucide/svelte/icons/clock-plus";

    import * as Card from "$ui/card";
    import { route } from "$lib/routes";
    
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
            <a class="no-underline group" href={route("/space/[spaceId=uid]/page/[pageId=uid]", { spaceId: space.id, pageId: space.homepage })}>
                <Card.Root>
                    <Card.Header>
                        <Card.Title class="group-hover:underline">
                            {space.title}
                        </Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <span>
                            <BookOpen /> {space.pageCount}
                        </span>
                        <span>
                            <ClockPlus /> {new Date(space.createdAt).toLocaleDateString()}
                        </span>
                    </Card.Content>
                </Card.Root>
            </a>
        {/each}
    {:else}
        loading...
    {/if}
</div>
