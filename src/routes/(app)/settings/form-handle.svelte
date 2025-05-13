<script lang="ts" module>
    export interface FormHandleProps {
        current: string;
    }
</script>

<script lang="ts">
    import { Button } from "$ui/button";
    import { Input } from "$ui/input";
    import { Label } from "$ui/label";
    import LoadingSpinner from "$ui/loading-spinner";

    import { useQueryClient } from "@tanstack/svelte-query";
    import { toast } from "svelte-sonner";

    import { api, createPutMutation, invalidateQuery } from "$lib/hc";
    import { debounce } from "$lib/utils";

    import Check from "@lucide/svelte/icons/check";
    import X from "@lucide/svelte/icons/x";

    const { current }: FormHandleProps = $props();
    const client = useQueryClient();
    const uid = $props.id();

    let value = $state("");
    const isValueValid = $derived(value.length > 3);

    const mut = createPutMutation({
        endpoint: api.account["update-handle"],
        onSuccess: () => {
            invalidateQuery(client, api.users.me);
        },
        onError: (e) => {
            toast.error("Failed to update Handle", {
                description: e.message,
            });
        },
    });

    const update = debounce(() => {
        $mut.mutate({ json: { handle: value } });
    }, 500);
</script>

<div class="flex flex-row items-end gap-2">
    <div class="flex flex-col gap-2 w-full">
        <Label for="{uid}-handle">Update Handle</Label>
        <Input
            id="{uid}-handle"
            type="text"
            autocomplete="username"
            placeholder={current}
            bind:value
        />
    </div>
    <Button
        class="w-24"
        disabled={$mut.isPending || !isValueValid}
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
