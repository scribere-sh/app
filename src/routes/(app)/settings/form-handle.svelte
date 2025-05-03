<script lang="ts" module>
    import type { PageData } from "./$types";

    export interface FormHandleProps {
        form: PageData["details"]["updateHandleForm"];
    }
</script>

<script lang="ts">
    import { getContext } from "svelte";

    import { superForm } from "sveltekit-superforms";

    import { invalidateQuery } from "$lib/hc";
    import { useQueryClient } from "@tanstack/svelte-query";

    import * as Form from "$ui/form";
    import { Input } from "$ui/input";
    import LoadingSpinner from "$ui/loading-spinner";

    import Check from "@lucide/svelte/icons/check";

    import { toast } from "svelte-sonner";

    import { route } from "$lib/routes";

    let disabled = $state(false);
    let success = $state(false);

    const csrf = getContext<string>("csrf");
    const client = useQueryClient();

    const { form: _form }: FormHandleProps = $props();

    const form = superForm(_form, {
        onSubmit: () => {
            disabled = true;
        },
        onResult: ({ result }) => {
            if (result.type !== "success") disabled = false;
            else success = true;

            invalidateQuery(client, ["get", "api", "users", "me"]);

            if (result.type === "failure") {
                console.error(result);
                if (
                    "data" in result
                    && typeof result.data !== "undefined"
                    && "message" in result.data
                ) {
                    toast.error(
                        `Failed to login: ${result.data!.message}`,
                    );
                }
            }
        },
    });

    const { form: data, enhance } = form;
</script>

<form
    method="POST"
    action={route("updateHandle /settings")}
    class="flex flex-row gap-2 items-end justify-between w-full"
    use:enhance
>
    <input type="hidden" name="csrf" value={csrf}>

    <Form.Field
        {form}
        name="handle"
        class="flex flex-col justify-between w-full"
    >
        <Form.Control>
            {#snippet children({ props })}
                <div class="flex flex-row items-start justify-between h-4">
                    <Form.Label>Update Handle</Form.Label>
                    <Form.FieldErrors />
                </div>
                <div class="w-full flex flex-row items-center pl-2 gap-2">
                    <span>@</span>
                    <Input
                        {...props}
                        {disabled}
                        type="text"
                        autocomplete="username"
                        placeholder="jane.doe23"
                        required
                        bind:value={$data.handle}
                    />
                </div>
            {/snippet}
        </Form.Control>
    </Form.Field>

    <Form.Button {disabled} class="w-32">
        {#if success}
            <Check class="stroke-green-500" />
        {:else if disabled}
            <LoadingSpinner />
        {:else}
            Update
        {/if}
    </Form.Button>
</form>
