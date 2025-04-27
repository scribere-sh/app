<script lang="ts">
    import type { WithElementRef } from "bits-ui";
    import type { HTMLAttributes } from "svelte/elements";

    let {
        ref = $bindable(),
        class: className,
        children,
        ...rest
    }: WithElementRef<HTMLAttributes<HTMLElement>> = $props();
</script>

<nav bind:this={ref} class={className} aria-label="breadcrumb" {...rest}>
    {@render children?.()}
</nav>
