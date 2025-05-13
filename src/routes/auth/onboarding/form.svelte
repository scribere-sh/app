<script lang="ts" module>
    import type { PageData } from "./$types";

    export interface FormProps {
        form: PageData["form"];
        disabled?: boolean;
        focussed: FocussableKey;

        csrf: string;
        email: string;
        challenge: string;
    }

    export type FocussableKey = keyof PageData["form"]["data"];
</script>

<script lang="ts">
    import { superForm } from "sveltekit-superforms";

    import { toast } from "svelte-sonner";

    import * as Form from "$ui/form";
    import { Input } from "$ui/input";
    import LoadingSpinner from "$ui/loading-spinner";

    import { FormDebug } from "$blk/form-debug";
    import { route } from "$lib/routes";

    let fieldRefs: Record<FocussableKey, HTMLElement | null> = $state({
        // hidden
        csrf: null,
        challenge: null,
        email: null,
        // shown
        display: null,
        handle: null,
        password: null,
        confirmPassword: null,
    });

    let {
        form: _form,
        disabled = $bindable(false),

        focussed = $bindable("display"),

        csrf,
        email,
        challenge,
    }: FormProps = $props();

    $effect(() => {
        if (fieldRefs[focussed]) {
            fieldRefs[focussed]?.focus();
        }
    });

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

    $effect(() => {
        // accounts for any use cases where any of these
        // get overwritten for some reason
        $data.csrf = csrf;
        $data.email = email;
        $data.challenge = challenge;
    });
</script>

<FormDebug {data} label="Onboarding" />

<form
    action={route("default /auth/onboarding")}
    method="POST"
    class="flex flex-col gap-4"
    use:enhance
>
    <input type="hidden" name="csrf" value={csrf} />

    <input type="hidden" name="email" value={email} />

    <input type="hidden" name="challenge" value={challenge} />

    <Form.Field {form} name="display">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label error={$errors.display !== undefined}>
                    Display Name
                </Form.Label>

                <Input
                    {...props}
                    {disabled}
                    error={$errors.display !== undefined}
                    type="text"
                    autocomplete="nickname"
                    placeholder="Jane Doe"
                    required
                    onfocus={() => focussed = "display"}
                    bind:value={$data.display}
                    bind:ref={fieldRefs.display}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="handle">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label error={$errors.handle !== undefined}>
                    Handle
                </Form.Label>

                <Input
                    {...props}
                    {disabled}
                    error={$errors.handle !== undefined}
                    type="text"
                    autocomplete="username"
                    placeholder="xx_jane.doe_xx"
                    required
                    onfocus={() => focussed = "handle"}
                    bind:value={$data.handle}
                    bind:ref={fieldRefs.handle}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="password">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label error={$errors.password !== undefined}>
                    Password
                </Form.Label>

                <Input
                    {...props}
                    {disabled}
                    error={$errors.password !== undefined}
                    type="password"
                    autocomplete="new-password"
                    placeholder="************"
                    required
                    onfocus={() => focussed = "password"}
                    bind:value={$data.password}
                    bind:ref={fieldRefs.password}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="confirmPassword">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label error={$errors.confirmPassword !== undefined}>
                    Confirm Password
                </Form.Label>

                <Input
                    {...props}
                    {disabled}
                    error={$errors.confirmPassword !== undefined}
                    type="password"
                    autocomplete="new-password"
                    placeholder="************"
                    required
                    onfocus={() => focussed = "password"}
                    bind:value={$data.confirmPassword}
                    bind:ref={fieldRefs.confirmPassword}
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
