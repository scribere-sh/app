<script lang="ts">
    import { type WithElementRef } from "bits-ui";
    import type { HTMLAttributes } from "svelte/elements";

    import { cn } from "$lib/utils";

    let {
        ref = $bindable(null),
        class: className,
        inset,
        children,
        ...rest
    }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
        inset?: boolean;
    } = $props();
</script>

<div
    bind:this={ref}
    class={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...rest}
>
    {@render children?.()}
</div>
