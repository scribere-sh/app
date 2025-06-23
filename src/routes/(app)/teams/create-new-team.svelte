<script lang="ts">
    import { goto } from "$app/navigation";
    import { api, createPostMutation } from "$lib/hc";
    import { route } from "$lib/routes";
    import { debounce } from "$lib/utils";

    import * as AlertDialog from "$ui/alert-dialog";
    import * as Card from "$ui/card";
    import { Input } from "$ui/input";
    import { Label } from "$ui/label";

    import Plus from "@lucide/svelte/icons/plus";

    const uid = $props.id();

    let open = $state(false);

    let newTeamName = $state("");
    let newTeamNameValid = $derived(newTeamName.length > 0);

    const createTeamMutation = createPostMutation({
        endpoint: api.teams.create,
    });

    const onCreateNewTeam = async () => {
        if (!newTeamNameValid) return;

        const { teamId } = await $createTeamMutation.mutateAsync({
            json: {
                name: newTeamName,
            },
        });

        goto(route("/teams/[teamId=uid]", { teamId }));
    };

    const onCancel = () => {
        open = false;
        newTeamName = "";
    };
</script>

<AlertDialog.Root bind:open>
    <AlertDialog.Trigger>
        <Card.Root
            class="w-96 h-36 group hover:bg-foreground/100 cursor-pointer"
        >
            <Card.Content
                class="flex flex-col gap-2 items-center justify-center"
            >
                <Plus class="size-16 opacity-70 group-hover:opacity-100" />
                <div class="text-2xl font-extrabold opacity-70 group-hover:opacity-100">
                    Create a Team
                </div>
            </Card.Content>
        </Card.Root>
    </AlertDialog.Trigger>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title class="text-background text-2xl"
            >Create a Team</AlertDialog.Title>
        </AlertDialog.Header>

        <div class="w-4/5 flex flex-col py-8 px-2 mx-auto gap-4">
            <Label class="text-background" for="{uid}-team-name"
            >Team Name</Label>
            <Input
                class="text-foreground bg-background"
                id="{uid}-team-name"
                type="text"
                placeholder="Team Rocket"
                disabled={$createTeamMutation.isPending}
                bind:value={newTeamName}
            />
        </div>

        <AlertDialog.Footer>
            <AlertDialog.Cancel
                disabled={$createTeamMutation.isPending}
                onclick={debounce(onCancel, 100)}
            >Cancel</AlertDialog.Cancel>
            <AlertDialog.Action
                disabled={$createTeamMutation.isPending}
                onclick={debounce(onCreateNewTeam, 100)}
            >Create</AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
