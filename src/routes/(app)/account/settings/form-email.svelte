<script lang="ts" module>
    export interface FormEmailProps {
        current?: string;
        disabled?: boolean;
    }
</script>

<script lang="ts">
    import { toast } from "svelte-sonner";

    import { Button } from "$ui/button";
    import { Input } from "$ui/input";
    import { Label } from "$ui/label";
    import LoadingSpinner from "$ui/loading-spinner";

    import Check from "@lucide/svelte/icons/check";
    import X from "@lucide/svelte/icons/x";

    import { api, createPutMutation } from "$lib/hc";
    import { debounce, EMAIL_REGEX } from "$lib/utils";

    const uid = $props.id();

    let {
        current,
        disabled = $bindable(false),
    }: FormEmailProps = $props();

    let newEmail = $state("");

    const newEmailIsValid = $derived(
        (newEmail.match(EMAIL_REGEX)?.length ?? 0) > 0,
    );

    const mut = createPutMutation({
        endpoint: api.account["update-email-address"],
        onSuccess: ({ message }) => {
            toast.success(message);
        },

        onError: ({ message }) => {
            toast.error(message);
        },
    });

    const update = debounce(() => {
        $mut.mutate({ json: { email: newEmail } });
    }, 500);
</script>

<form
    class="flex flex-row items-end gap-2 w-full"
    onsubmit={(e) => {
        e.preventDefault();
        update(e);
    }}
>
    <div class="flex flex-col gap-4 w-full">
        <Label for="{uid}-update-email">Update Email Address</Label>

        <Input
            id="{uid}-update-email"
            class="w-full"
            disabled={$mut.isPending}
            type="email"
            autocomplete="email"
            placeholder={current ?? "..."}
            bind:value={newEmail}
        />
    </div>

    <Button
        class="w-24"
        disabled={$mut.isPending || !newEmailIsValid}
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
