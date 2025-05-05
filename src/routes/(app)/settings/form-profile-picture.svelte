<script lang="ts" module>
    import type { PageData } from "./$types";

    export interface FormProfilePictureProps {
        form: PageData["details"]["updateProfilePicutreForm"];
    }
</script>

<script lang="ts">
    import { getContext } from "svelte";

    import { fileProxy, superForm } from "sveltekit-superforms";

    import * as Form from "$ui/form";
    import { Input } from "$ui/input";
    import LoadingSpinner from "$ui/loading-spinner";

    import Check from "@lucide/svelte/icons/check";

    import { toast } from "svelte-sonner";

    import { route } from "$lib/routes";

    let disabled = $state(false);
    let success = $state(false);

    const csrf = getContext<string>("csrf");

    const { form: _form }: FormProfilePictureProps = $props();

    const form = superForm(_form, {
        onSubmit: () => {
            disabled = true;
        },
        onResult: ({ result }) => {
            if (result.type !== "success") disabled = false;
            else success = true;

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

    const files = fileProxy(form, "image");

    const { enhance } = form;
</script>

<form
    method="POST"
    action={route("updateProfilePicture /settings")}
    enctype="multipart/form-data"
    class="flex flex-row gap-2 items-end justify-between w-full"
    use:enhance
>
    <input type="hidden" name="csrf" value={csrf}>

    <Form.Field
        {form}
        name="image"
        class="flex flex-col justify-between w-full"
    >
        <Form.Control>
            {#snippet children({ props })}
                <div class="flex flex-row items-start justify-between h-4">
                    <Form.Label>Update Profile Picture</Form.Label>
                    <Form.FieldErrors />
                </div>
                <Input
                    {...props}
                    type="file"
                    accept="image/*"
                    required
                    {disabled}
                    bind:files={$files}
                />
            {/snippet}
        </Form.Control>
    </Form.Field>

    <Form.Button {disabled} class="w-32">
        {#if success}
            <Check class="stroke-green-500" />
        {:else if disabled}
            <LoadingSpinner />
        {:else}
            Upload
        {/if}
    </Form.Button>
</form>
