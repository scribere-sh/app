<script lang="ts">
    import { api, createQuery } from "$lib/hc";

    import CreateTeamCard from "./create-new-team.svelte";
    import TeamCard from "./team-card.svelte";

    const teamsQuery = createQuery({
        endpoint: api.teams.getUserTeams,
    });
</script>

<h1 class="text-2xl w-page mb-8 text-background">
    Teams
</h1>

<div class="w-page flex flex-wrap gap-8 items-start">
    {#if $teamsQuery.data}
        {#each $teamsQuery.data as team (team.id)}
            <TeamCard {team} />
        {:else}
            <!-- No Teams -->
            <!-- Todo: this -->
        {/each}
        <CreateTeamCard />
    {/if}
</div>
