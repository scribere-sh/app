<script lang="ts">
    import { cn } from "$lib/utils";
    import { Tabs as TabsPrimitive } from "bits-ui";

    let {
        ref = $bindable(null),
        class: className,

        ...rest
    }: TabsPrimitive.ListProps = $props();
</script>

<!-- not muted it not defined -->

<TabsPrimitive.List
    bind:ref
    data-slot="tabs-list"
    class={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className,
    )}
    {...rest}
/>
