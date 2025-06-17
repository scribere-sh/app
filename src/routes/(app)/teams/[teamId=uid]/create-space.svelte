<script lang="ts" module>
    import type { PageData } from "./$types";

    interface CreateSpaceProps {
        teamId: PageData['teamId']
    }
</script>

<script lang="ts">
    import { goto } from "$app/navigation";

    import * as AlertDialog from "$ui/alert-dialog";
    import { buttonVariants } from "$ui/button";
    import { Input } from "$ui/input";
    import { Label } from "$ui/label";

    import { api, createPostMutation } from "$lib/hc";

    import Plus from "@lucide/svelte/icons/plus";
    import X from "@lucide/svelte/icons/x";

    import { toast } from "svelte-sonner";
    import { route } from "$lib/routes";

    let open = $state(false);

    const uid = $props.id();

    const {
        teamId
    }: CreateSpaceProps = $props();

    const createSpaceMutation = createPostMutation({
        endpoint: api.teams.createSpace,

        onSuccess: (data) => {
            console.log(data);

            goto(
                route(
                    "/space/[spaceId=uid]/page/[pageId=uid]", 
                    {
                        spaceId: data.spaceId,
                        pageId: data.homepageId
                    }
                )
            );
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to create space", { description: error.message });
        },
        onSettled: () => {
            open = false;
            spaceTitle = "";
        }
    });

    let spaceTitle = $state("");
    let spaceTitleValid = $derived(spaceTitle.length == 0 || (spaceTitle.length > 2 && spaceTitle.length < 35));

    const onAction = (ev: MouseEvent) => {
        ev.preventDefault();

        if (!spaceTitleValid) return;

        $createSpaceMutation.mutate({
            query: {
                team: teamId
            },
            json: {
                title: spaceTitle
            }
        });
    };

    const onCancel = (ev?: MouseEvent) => {
        if (ev) ev.preventDefault();

        open = false;
        spaceTitle = "";
    }
</script>

<AlertDialog.Root bind:open onOpenChange={(val) => {if (!val) onCancel()}}>
    <AlertDialog.Trigger class={buttonVariants({ size: "lg" })}>
        <Plus /> Create Space
    </AlertDialog.Trigger>
    <AlertDialog.Content>
        <AlertDialog.Header class="inline-flex flex-row gap-2">
            <Plus /> Create a Space
        </AlertDialog.Header>
        <div class="w-4/5 flex flex-col py-8 px-2 mx-auto gap-4">
            <Label class="font-bold" for="{uid}-space-title">Space Title</Label>
            <Input disabled={$createSpaceMutation.isPending} placeholder="Cool Space Name" id="{uid}-space-title" type="text" autocomplete="off" error={!spaceTitleValid} bind:value={spaceTitle} />
        </div>
        <AlertDialog.Footer>
            <AlertDialog.Cancel variant="outline" disabled={$createSpaceMutation.isPending}><X /> Cancel</AlertDialog.Cancel>
            <AlertDialog.Action type="submit" onclick={onAction} disabled={!spaceTitleValid || $createSpaceMutation.isPending}><Plus /> Create</AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>

