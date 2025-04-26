<script lang="ts">
    import type { WithElementRef } from "bits-ui";
    import type { HTMLAnchorAttributes } from "svelte/elements";

    import { type BadgeVariant, badgeVariants } from ".";

    import { cn } from "$lib/utils";

    let {
        ref = $bindable(null),
        href,
        class: className,
        variant = "default",
        children,
        ...rest
    }: WithElementRef<HTMLAnchorAttributes> & {
        variant?: BadgeVariant;
    } = $props();
</script>

<svelte:element
    this={href ? "a" : "span"}
    bind:this={ref}
    {href}
    class={cn(badgeVariants({ variant }), className)}
    {...rest}
>
    {@render children?.()}
</svelte:element>
