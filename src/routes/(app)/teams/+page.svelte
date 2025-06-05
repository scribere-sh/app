<script lang="ts">
    import { api, createQuery } from "$lib/hc";

    import TeamCard from "./team-card.svelte";

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
