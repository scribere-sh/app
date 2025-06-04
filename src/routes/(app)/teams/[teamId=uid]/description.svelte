<script lang="ts" module>
    export interface DescriptionProps {
        description: object;
        teamId: string;
    }
</script>

<script lang="ts">
    import { Editor } from "$lib/editor";

    import { Button } from "$ui/button";
    import LoadingSpinner from "$ui/loading-spinner";

    import Check from "@lucide/svelte/icons/check";
    import Edit from "@lucide/svelte/icons/edit";
    import X from "@lucide/svelte/icons/x";

    import { api, createPutMutation } from "$lib/hc";

    import { toast } from "svelte-sonner";

    let isEditing = $state(false);

    let {
        description,
        teamId,
    }: DescriptionProps = $props();

    let descriptionSnapshot = $state(description);

    const updateDescriptionMutation = createPutMutation({
        endpoint: api.teams.updateDescription[":team"],
        onError: (err) => {
            console.error(err.message);
            toast.error("Error Occured During Update", {
                description: err.message,
            });
        },
        onSuccess: (data) => {
            descriptionSnapshot = data;
            isEditing = false;
            toast.success("Success", {
                description: "Updated Team Description",
            });
        },
    });

    const cancelEdit = () => {
        isEditing = false;
        description = $state.snapshot(descriptionSnapshot);
    };

    const commitEdit = () => {
        isEditing = false;
        $updateDescriptionMutation.mutate({
            param: {
                team: teamId,
            },
            json: {
                content: $state.snapshot(description),
            },
        });
    };
</script>

{#if isEditing || $updateDescriptionMutation.isPending}
    <Button
        variant="ghost"
        size="icon"
        class="absolute -translate-x-[110%]"
        onclick={commitEdit}
    >
        {#if $updateDescriptionMutation.isPending}
            <LoadingSpinner />
        {:else}
            <Check class="text-green-500" />
        {/if}
    </Button>

    <Button
        variant="destructive-ghost"
        size="icon"
        class="absolute text-red-500 hover:text-foreground"
        onclick={cancelEdit}
    >
        <X />
    </Button>
{:else}
    <Button
        variant="ghost"
        size="icon"
        class="absolute"
        onclick={() => {
            descriptionSnapshot = $state.snapshot(description);
            isEditing = true;
        }}
    >
        <Edit />
    </Button>
{/if}

{#key isEditing}
    {#key descriptionSnapshot}
        <Editor
            doc={descriptionSnapshot}
            active={isEditing}
            onupdate={(doc) => description = doc}
        />
    {/key}
{/key}
