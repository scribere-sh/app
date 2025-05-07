<script lang="ts" module>
    import type { PageData } from "./$types";

    export interface FormProps {
        form: PageData["form"];
        disabled?: boolean;
        csrf: string;
        id: string;
        challenge: string;
    }
</script>

<script lang="ts">
    import { toast } from "svelte-sonner";
    import { superForm } from "sveltekit-superforms";

    import * as Form from "$ui/form";
    import { Input } from "$ui/input";
    import LoadingSpinner from "$ui/loading-spinner";

    import { route } from "$lib/routes";

    let firstFieldRef: HTMLElement | null = $state(null);

    $effect(() => {
        if (firstFieldRef) firstFieldRef.focus();
    });

    let {
        form: _form,
        disabled = $bindable(false),

        csrf,
        id,
        challenge,
    }: FormProps = $props();

    const form = superForm(_form, {
        onSubmit: () => {
            disabled = true;
        },
        onResult: ({ result }) => {
            if (result.type !== "redirect") disabled = false;
            if (result.type === "failure") {
                if (
                    "data" in result
                    && typeof result.data !== "undefined"
                    && "message" in result.data
                ) {
                    toast.error(
                        `Failed to register: ${result.data!.message}`,
                    );
                }
            }
        },
    });

    const { form: data, enhance, errors } = form;
</script>

<form
    action={route("default /auth/change-password/callback")}
    method="POST"
    class="flex flex-col gap-4"
    use:enhance
>
    <input type="hidden" name="csrf" value={csrf}>
    <input type="hidden" name="id" value={id}>
    <input type="hidden" name="challenge" value={challenge}>

    <Form.Field {form} name="password">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label error={$errors.password !== undefined}>
                    New Password
                </Form.Label>

                <Input
                    {...props}
                    {disabled}
                    error={$errors.password !== undefined}
                    type="password"
                    autocomplete="new-password"
                    placeholder="************"
                    required
                    bind:value={$data.password}
                    bind:ref={firstFieldRef}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="confirmPassword">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label error={$errors.confirmPassword !== undefined}>
                    Confirm New Password
                </Form.Label>

                <Input
                    {...props}
                    {disabled}
                    error={$errors.confirmPassword !== undefined}
                    type="password"
                    autocomplete="new-password"
                    placeholder="************"
                    required
                    bind:value={$data.confirmPassword}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Button {disabled} class="w-full">
        {#if disabled}
            <LoadingSpinner class="stroke-background" />
        {:else}
            Create Account
        {/if}
    </Form.Button>
</form>
