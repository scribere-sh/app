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

<div
    bind:this={ref}
    class={cn(
        "bg-foreground/50 text-background rounded-lg border-4 shadow-sm backdrop-blur-sm",
        className,
    )}
    {...rest}
>
    {@render children?.()}
</div>
