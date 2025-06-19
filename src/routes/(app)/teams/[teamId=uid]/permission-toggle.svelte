<script lang="ts">
    import { api, createPostMutation } from "$lib/hc";

    import { Checkbox } from "$ui/checkbox";

    let {
        teamId,
        userId,
        permission,
        enabled
    }: {
        teamId: string,
        userId: string,
        permission: string,

        enabled: boolean
    } = $props();

    let potentiallyEnabled = $derived(enabled);

    const updateMutation = createPostMutation({
        endpoint: api.teams.updatePermissions,
        onSettled: (data, error) => {
            if (data) {
                potentiallyEnabled = data.newState;
            } else {
                console.error(error);
                potentiallyEnabled = enabled;
            }
        }
    });

    const onclick = () => {
        $updateMutation
            .mutate({
                query: { 
                    team: teamId 
                },
                json: {
                    enabled: potentiallyEnabled,
                    user: userId,
                    permission
                }
            });
    } 
</script>

<Checkbox 
    disabled={$updateMutation.isPending}
    checked={potentiallyEnabled}
    {onclick}
/>
