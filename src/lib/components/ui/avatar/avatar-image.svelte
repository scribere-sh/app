<script lang="ts">
    import { Avatar as AvatarPrimitive } from "bits-ui";

    import { cn } from "$lib/utils";

    let { ref = $bindable(null), class: className, ...rest }:
        AvatarPrimitive.ImageProps = $props();
</script>

<AvatarPrimitive.Image
    bind:ref
    class={cn(
        "aspect-square size-full animate-in fade-in slide-in-from-left-0",
        className,
    )}
    {...rest}
/>
