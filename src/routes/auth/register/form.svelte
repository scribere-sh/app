<script lang="ts" module>
    import type { PageData } from "./$types";

    export interface FormProps {
        form: PageData["form"];
        disabled?: boolean;
        accepting?: boolean;
        csrf: string;
    }
</script>

<script lang="ts">
    import { superForm } from "sveltekit-superforms";

    import { toast } from "svelte-sonner";

    import * as Form from "$ui/form";
    import { Input } from "$ui/input";
    import LoadingSpinner from "$ui/loading-spinner";
    import * as Tooltip from "$ui/tooltip";

    import TriangleAlert from "@lucide/svelte/icons/triangle-alert";

    import { FormDebug } from "$blk/form-debug";
    import { route } from "$lib/routes";
    import { cn } from "$lib/utils";

    let firstFieldRef: HTMLElement | null = $state(null);

    $effect(() => {
        if (firstFieldRef) firstFieldRef.focus();
    });

    let { form: _form, disabled = $bindable(false), accepting, csrf }:
        FormProps = $props();

    const form = superForm(_form, {
        onSubmit: () => {
            disabled = true;
        },
        onResult: ({ result }) => {
            console.debug(result);
            if (result.type !== "redirect") disabled = false;

            if (result.type === "error") {
                toast.error(
                    `Failed to register: ${result.error.message}`,
                );
            } else if (result.type === "failure") {
                if (
                    "data" in result
                    && typeof result.data !== "undefined"
                    && "message" in result.data
                ) {
                    toast.error(
                        `Failed to register: ${result.data!.message}`,
                    );
                }
            } else if (result.type === "success") {
                // the action should return an object with the
                // original email we can set as the value
                $data.email = result.data?.email || "Submitted!";
                success = true;
                toast.success("Check your email inbox to continue!");
            }
        },
    });

    let success = $state(false);

    const { form: data, enhance, errors } = form;

    $effect(() => {
        $data.csrf = csrf;
    });
</script>

<FormDebug {data} label="Register" />

<Tooltip.Provider>
    <form
        action={route("default /auth/register")}
        method="POST"
        class="flex flex-col gap-4"
        use:enhance
    >
        <input type="hidden" name="csrf" value={csrf} />

        <Form.Field {form} name="email">
            <Form.Control>
                {#snippet children({ props })}
                    <div class="flex h-6 items-center justify-between">
                        <Form.Label
                            error={$errors.email !== undefined
                            || !accepting}
                            class={cn(success && "text-green-400")}
                        >
                            Email Address
                        </Form.Label>
                        <Form.FieldErrors />
                        {#if !accepting}
                            <Tooltip.Root>
                                <Tooltip.Trigger>
                                    <!-- colors copied from sonner -->
                                    <TriangleAlert
                                        class="size-4 stroke-current dark:stroke-[hsl(46,87%,65%)]"
                                    />
                                </Tooltip.Trigger>
                                <Tooltip.Content>
                                    <p>
                                        Scribere is not currently accepting
                                        registrations
                                    </p>
                                </Tooltip.Content>
                            </Tooltip.Root>
                        {/if}
                    </div>

                    <Input
                        {...props}
                        disabled={disabled || success || !accepting}
                        class={cn(
                            success
                                && "border-green-400 focus-visible:ring-green-400",
                        )}
                        error={$errors.email !== undefined}
                        type="text"
                        autocomplete="email"
                        placeholder="email@example.com"
                        required
                        bind:value={$data.email}
                        bind:ref={firstFieldRef}
                    />
                {/snippet}
            </Form.Control>
        </Form.Field>

        <Form.Button
            disabled={disabled || success || !accepting}
            class="w-full"
        >
            {#if disabled}
                <LoadingSpinner class="stroke-background" />
            {:else if !accepting}
                Not Currently Accepting
            {:else if success}
                Check your Inbox!
            {:else}
                Register
            {/if}
        </Form.Button>
    </form>
</Tooltip.Provider>
