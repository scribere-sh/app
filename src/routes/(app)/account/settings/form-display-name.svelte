<script lang="ts" module>
    export interface FormDisplayNameProps {
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

    const { current }: FormDisplayNameProps = $props();
    const client = useQueryClient();
    const uid = $props.id();

    let value = $state("");
    const isValueValid = $derived(value.length > 0);

    const mut = createPutMutation({
        endpoint: api.account["update-display-name"],
        onSuccess: () => {
            invalidateQuery(client, api.users.me);
        },
        onError: (e) => {
            toast.error("Failed to update Display Name", {
                description: e.message,
            });
        },
    });

    const update = debounce(() => {
        $mut.mutate({ json: { displayName: value } });
    }, 500);
</script>

<form
    class="flex flex-row items-end gap-2"
    onsubmit={(e) => {
        e.preventDefault();
        update(e);
    }}
>
    <div class="flex flex-col gap-2 w-full">
        <Label for="{uid}-display-name">Update Display Name</Label>
        <Input
            id="{uid}-display-name"
            disabled={$mut.isPending}
            type="text"
            autocomplete="nickname"
            placeholder={current}
            bind:value
        />
    </div>
    <Button
        class="w-24"
        disabled={$mut.isPending || !isValueValid}
        type="submit"
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
</form>
