<script lang="ts">
    import type { WithElementRef } from "bits-ui";
    import type { HTMLAttributes } from "svelte/elements";

    import { cn } from "$lib/utils";

    let {
        ref = $bindable(null),
        class: className,
        children,
        ...rest
    }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} class={cn("flex items-center", className)} {...rest}>
    {@render children?.()}
</div>
