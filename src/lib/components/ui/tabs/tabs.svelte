<script lang="ts">
    import { cn } from "$lib/utils";
    import { Tabs as TabsPrimitive } from "bits-ui";

    let {
        ref = $bindable(null),
        class: className,

        ...rest
    }: TabsPrimitive.RootProps = $props();
</script>

<TabsPrimitive.Root
    bind:ref
    data-slot="tabs"
    class={cn("flex flex-col gap-2", className)}
    {...rest}
/>
