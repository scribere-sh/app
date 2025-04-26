<script lang="ts">
    import type { WithElementRef } from "bits-ui";
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
    role="link"
    aria-disabled="true"
    aria-current="page"
    class={cn("text-foreground font-normal", className)}
    {...rest}
>
    {@render children?.()}
</span>
