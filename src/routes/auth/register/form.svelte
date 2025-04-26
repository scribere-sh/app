<script
    lang="ts"
    module
>
    import type { PageData } from "./$types";

    export interface FormProps {
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

    import { route } from "$lib/routes";
    import LoadingSpinner from "$ui/loading-spinner";

    let firstFieldRef: HTMLElement | null = $state(null);

    $effect(() => {
        if (firstFieldRef) firstFieldRef.focus();
    });

    let { form: _form, disabled = $bindable(false), csrf }: FormProps =
        $props();

    const form = superForm(_form, {
        onSubmit: () => {
            disabled = true;
        },
        onResult: ({ result }) => {
            console.log(result);
            if (result.type !== "redirect") disabled = false;

            if (result.type === "error") {
                console.error(result);
                toast.error(
                    `Failed to register: ${result.error.message}`,
                );
            } else if (result.type === "failure") {
                console.error(result);
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
    action={route("default /auth/register")}
    use:enhance
    method="POST"
    class="flex flex-col gap-4"
>
    <input
        type="hidden"
        name="csrf"
        value={csrf}
    />

    <Form.Field
        {form}
        name="email"
    >
        <Form.Control>
            {#snippet children({ props })}
                <div class="flex h-6 items-center justify-between">
                    <Form.Label error={$errors.email !== undefined}
                    >Email Address</Form.Label>
                    <Form.FieldErrors />
                </div>

                <Input
                    {...props}
                    {disabled}
                    error={$errors.email !== undefined}
                    type="text"
                    autocomplete="email"
                    placeholder="email@contoso.com"
                    required
                    bind:value={$data.email}
                    bind:ref={firstFieldRef}
                />
            {/snippet}
        </Form.Control>
    </Form.Field>

    <Form.Button
        {disabled}
        variant="foreground"
        class="w-full"
    >
        {#if disabled}
            <LoadingSpinner class="stroke-background" />
        {:else}
            Register
        {/if}
    </Form.Button>
</form>
