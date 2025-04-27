<script lang="ts">
    import { dev } from "$app/environment";
    import { cn } from "$lib/utils";

    import * as Card from "$ui/card";
    import { Checkbox } from "$ui/checkbox";
    import { fly } from "svelte/transition";

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
    <Card.Root class="absolute top-4 right-4 border-red-500 z-50">
        <Card.Header
            class={cn(
                "flex flex-row items-center justify-between pb-6",
            )}
        >
            <Checkbox bind:checked={show} />
        </Card.Header>
    </Card.Root>

    {#if show}
        <div
            transition:fly={{ x: 10, duration: 200 }}
            class="absolute right-4 top-auto bottom-auto"
        >
            <Card.Root class="border-red-500 w-96 max-h-96">
                <Card.Content>
                    <SuperDebug {data} {label} />
                </Card.Content>
            </Card.Root>
        </div>
    {/if}
{/if}
