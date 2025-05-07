<script lang="ts" module>
    import type { PageData } from "./$types";

    export interface UpdatePasswordFormProps {
        form: PageData["form"];
        disabled?: boolean;
        csrf: string;
    }
</script>

<script lang="ts">
    import { superForm } from "sveltekit-superforms";

    import { toast } from "svelte-sonner";

    import * as Form from "$ui/form";
    import { Input } from "$ui/input";
    import LoadingSpinner from "$ui/loading-spinner";

    import { FormDebug } from "$blk/form-debug";
    import { route } from "$lib/routes";

    let firstFieldRef: HTMLElement | null = $state(null);

    $effect(() => {
        if (firstFieldRef) firstFieldRef.focus();
    });

    let { form: _form, disabled = $bindable(false), csrf }:
        UpdatePasswordFormProps = $props();

    const form = superForm(_form, {
        onSubmit: () => {
            disabled = true;
        },
        onResult: ({ result }) => {
            console.log(result);
            if (result.type !== "redirect") disabled = false;

            if (result.type === "error") {
                console.error(result);
                toast.error(`Failed to login: ${result.error.message}`);
            } else if (result.type === "failure") {
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

    const { form: data, enhance, errors } = form;

    $effect(() => {
        $data.csrf = csrf;
    });
</script>

<FormDebug {data} label="Update Password" />

<form
    action={route("default /auth/update-password")}
    method="POST"
    class="flex flex-col gap-4"
    use:enhance
>
    <input type="hidden" name="csrf" value={csrf} />

    <Form.Field {form} name="email">
        <Form.Control>
            {#snippet children({ props })}
                <div class="flex h-6 items-center justify-between">
                    <Form.Label error={$errors.email !== undefined}>
                        Account Email Address
                    </Form.Label>
                    <Form.FieldErrors />
                </div>

                <Input
                    {...props}
                    {disabled}
                    error={$errors.email !== undefined}
                    type="email"
                    autocomplete="email"
                    placeholder="email@example.com"
                    required
                    bind:value={$data.email}
                    bind:ref={firstFieldRef}
                />
            {/snippet}
        </Form.Control>
    </Form.Field>

    <Form.Button {disabled} class="w-full">
        {#if disabled}
            <LoadingSpinner class="stroke-background" />
        {:else}
            Sign In
        {/if}
    </Form.Button>
</form>
