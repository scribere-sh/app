<script lang="ts">
    import type { WithElementRef } from "bits-ui";
    import type { HTMLAttributes } from "svelte/elements";

    import { cn } from "$lib/utils";

    let {
        ref = $bindable(null),
        class: className,
        children,
        ...rest
    }: WithElementRef<HTMLAttributes<HTMLParagraphElement>> = $props();
</script>

<p
    bind:this={ref}
    class={cn("text-muted-foreground text-sm", className)}
    {...rest}
>
    {@render children?.()}
</p>
