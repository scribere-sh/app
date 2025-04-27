<script lang="ts" module>
</script>

<script lang="ts">
    import type { WithElementRef } from "bits-ui";
    import type { HTMLAttributes } from "svelte/elements";

    import { type AlertVariant, alertVariants } from ".";

    import { cn } from "$lib/utils";

    let {
        ref = $bindable(null),
        class: className,
        variant = "default",
        children,
        ...rest
    }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
        variant?: AlertVariant;
    } = $props();
</script>

<div
    bind:this={ref}
    class={cn(alertVariants({ variant }), className)}
    {...rest}
    role="alert"
>
    {@render children?.()}
</div>
