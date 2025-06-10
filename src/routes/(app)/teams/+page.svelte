<script lang="ts">
    import { api, createQuery } from "$lib/hc";

    import TeamCard from "./team-card.svelte";

    import { Space } from "$ui/card";

    const teamsQuery = createQuery({
        endpoint: api.teams.getUserTeams,
    });
</script>

{#if $teamsQuery.data}
    {#each $teamsQuery.data as team (team.id)}
        <TeamCard {team} />
    {:else}
        <!-- No Teams -->
        <!-- Todo: this -->
    {/each}
{/if}

<Space
    spaceName="Space Name"
    spaceId=""
    homePageId=""
    pageCount={1}
    lastUpdated={new Date("2025-06-10T00:22:37Z")}
/>
