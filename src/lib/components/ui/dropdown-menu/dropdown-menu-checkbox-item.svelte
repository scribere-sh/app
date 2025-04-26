<script lang="ts">
    import Check from "@lucide/svelte/icons/check";
    import Minus from "@lucide/svelte/icons/minus";

    import {
        DropdownMenu as DropdownMenuPrimitive,
        type WithoutChildrenOrChild,
    } from "bits-ui";

    import type { Snippet } from "svelte";

    import { cn } from "$lib/utils";

    let {
        ref = $bindable(null),
        checked = $bindable(false),
        indeterminate = $bindable(false),
        class: className,
        children: childrenProp,
        ...rest
    }:
        & WithoutChildrenOrChild<
            DropdownMenuPrimitive.CheckboxItemProps
        >
        & {
            children?: Snippet;
        } = $props();
</script>

<DropdownMenuPrimitive.CheckboxItem
    bind:ref
    bind:checked
    bind:indeterminate
    class={cn(
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
    )}
    {...rest}
>
    {#snippet children({ checked, indeterminate })}
        <span class="absolute left-2 flex size-3.5 items-center justify-center">
            {#if indeterminate}
                <Minus class="size-4" />
            {:else}
                <Check class={cn("size-4", !checked && "text-transparent")} />
            {/if}
        </span>
        {@render childrenProp?.()}
    {/snippet}
</DropdownMenuPrimitive.CheckboxItem>
