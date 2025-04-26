<script lang="ts">
    import ChevronRight from "@lucide/svelte/icons/chevron-right";
    import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

    import { cn } from "$lib/utils";

    let {
        ref = $bindable(null),
        class: className,
        inset,
        children,
        ...rest
    }: DropdownMenuPrimitive.SubTriggerProps & {
        inset?: boolean;
    } = $props();
</script>

<DropdownMenuPrimitive.SubTrigger
    bind:ref
    class={cn(
        "data-[highlighted]:bg-accent data-[state=open]:bg-accent flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        inset && "pl-8",
        className,
    )}
    {...rest}
>
    {@render children?.()}
    <ChevronRight class="ml-auto" />
</DropdownMenuPrimitive.SubTrigger>
