<script lang="ts">
    import { dev } from "$app/environment";
    import { cn } from "$lib/utils";

    import * as Card from "$ui/card";
    import { Checkbox } from "$ui/checkbox";
    import { fly } from "svelte/transition";

    import Bug from "@lucide/svelte/icons/bug";

    import SuperDebug from "sveltekit-superforms";

    const {
        data,
        label,
    }: {
        data: unknown;
        label?: string;
    } = $props();

    let show = $state(false);
</script>

{#if dev}
    <Card.Root class="fixed top-4 right-4 border-red-400 z-50">
        <Card.Header
            class={cn(
                "flex flex-row items-center justify-between pb-6 gap-6",
            )}
        >
            <Bug class="size-4 mb-0 stroke-red-400" />
            <Checkbox bind:checked={show} />
        </Card.Header>
    </Card.Root>

    {#if show}
        <div
            transition:fly={{ x: -10, duration: 200 }}
            class="fixed left-4 top-4"
        >
            <Card.Root class="border-red-400 w-96 max-h-96">
                <Card.Content>
                    <SuperDebug {data} {label} />
                </Card.Content>
            </Card.Root>
        </div>
    {/if}
{/if}
