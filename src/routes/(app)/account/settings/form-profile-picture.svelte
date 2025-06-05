<script lang="ts">
    import { Button } from "$ui/button";
    import { Input } from "$ui/input";
    import { Label } from "$ui/label";
    import LoadingSpinner from "$ui/loading-spinner";

    import { useQueryClient } from "@tanstack/svelte-query";
    import { toast } from "svelte-sonner";

    import {
        api,
        createPutMutation,
        invalidateBlobQuery,
    } from "$lib/hc";
    import { debounce } from "$lib/utils";

    import Check from "@lucide/svelte/icons/check";
    import X from "@lucide/svelte/icons/x";

    const client = useQueryClient();
    const uid = $props.id();

    let files: FileList | undefined = $state(undefined);

    const file = $derived(
        files === undefined
            ? null
            : (files as FileList).item(0),
    );
    const hasImage = $derived(file !== null);

    const mut = createPutMutation({
        endpoint: api.account.updateProfilePicture,
        onSuccess: () => {
            invalidateBlobQuery(
                client,
                api.assets.profilePicture.me,
            );

            toast.success("Updated profile picture", {
                dismissable: true,
            });
        },
        onError: (e) => {
            toast.error("Failed to update Profile Picture", {
                description: e.message,
                dismissable: true,
            });
        },
    });

    const update = debounce(() => {
        if (file) $mut.mutate({ form: { file } });
        else toast.error("Unable to upload file");
    }, 500);
</script>

<div class="flex flex-row items-end gap-2">
    <div class="flex flex-col gap-2 w-full">
        <Label for="{uid}-pfp">Change Profile Picture</Label>
        <Input
            id="{uid}-pfp"
            disabled={$mut.isPending}
            type="file"
            accept="image/*"
            onchange={() => {
                // if they update again
                // it resets the button
                if ($mut.isSuccess || $mut.isError) $mut.reset();
            }}
            bind:files
        />
    </div>
    <Button
        class="w-24"
        disabled={$mut.isPending || !hasImage}
        onclick={update}
    >
        {#if $mut.isPending}
            <LoadingSpinner />
        {:else if $mut.isSuccess}
            <Check class="stroke-green-500" />
        {:else if $mut.isError}
            <X class="stroke-red-500" />
        {:else}
            Update
        {/if}
    </Button>
</div>
