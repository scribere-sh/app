<script lang="ts">
    import * as AlertDialog from "$ui/alert-dialog";
    import * as Card from "$ui/card";
    import { Input } from "$ui/input";
    import { Label } from "$ui/label";

    import Plus from "@lucide/svelte/icons/plus";

    const uid = $props.id();

    let newTeamName = $state("");
</script>

<AlertDialog.Root>
    <AlertDialog.Trigger>
        <Card.Root class="w-96 h-36 group hover:bg-input/50 cursor-pointer">
            <Card.Content
                class="flex flex-col gap-2 items-center justify-center"
            >
                <Plus class="size-16 opacity-50" />
                <div>Create a Space</div>
            </Card.Content>
        </Card.Root>
    </AlertDialog.Trigger>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Create a Team</AlertDialog.Title>
        </AlertDialog.Header>

        <div class="w-4/5 flex flex-col py-8 px-2 mx-auto gap-4">
            <Label for="{uid}-team-name">Team Name</Label>
            <Input
                id="{uid}-team-name"
                type="text"
                placeholder="Team Rocket"
                bind:value={newTeamName}
            />
        </div>

        <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action>Create</AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
