<script lang="ts">
    import { AlertDialog as AlertDialogPrimitive } from "bits-ui";

    import { cn } from "$lib/utils";
    import {
        type ButtonSize,
        type ButtonVariant,
        buttonVariants,
    } from "$ui/button";

    let {
        ref = $bindable(null),
        class: className,
        variant = "confirm",
        size,
        ...rest
    }: AlertDialogPrimitive.ActionProps & {
        variant?: ButtonVariant;
        size?: ButtonSize;
    } = $props();
</script>

<AlertDialogPrimitive.Action
    bind:ref
    type="button"
    class={cn(buttonVariants({ variant, size }), className)}
    {...rest}
/>
