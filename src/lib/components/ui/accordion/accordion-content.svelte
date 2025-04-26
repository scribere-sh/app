<script lang="ts">
    import {
        Accordion as AccordionPrimitive,
        type WithoutChild,
    } from "bits-ui";

    import { cn } from "$lib/utils";

    let {
        ref = $bindable(null),
        class: className,
        children,
        ...rest
    }: WithoutChild<AccordionPrimitive.ContentProps> = $props();
</script>

<AccordionPrimitive.Content
    bind:ref
    class={cn(
        "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm transition-all",
        className,
    )}
    {...rest}
>
    <div class="pt-0 pb-4">
        {@render children?.()}
    </div>
</AccordionPrimitive.Content>
