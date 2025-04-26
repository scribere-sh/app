<script lang="ts">
    import { type WithElementRef } from "bits-ui";
    import type { HTMLAttributes } from "svelte/elements";

    import { cn } from "$lib/utils";

    let {
        ref = $bindable(null),
        class: className,
        children,
        ...rest
    }: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
    bind:this={ref}
    class={cn("ml-auto text-xs tracking-widest opacity-60", className)}
    {...rest}
>
    {@render children?.()}
</span>
