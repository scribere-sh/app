<script lang="ts">
    import type { WithoutChild } from "bits-ui";
    import * as FormPrimitive from "formsnap";

    import { cn } from "$lib/utils";
    import { Label } from "$ui/label";

    let {
        ref = $bindable(null),
        children,
        class: className,
        error = false,
        ...rest
    }: WithoutChild<FormPrimitive.LabelProps> & { error?: boolean } =
        $props();
</script>

<!-- red with errors 'data-[fs-error]:text-destructive' -->

<FormPrimitive.Label {...rest} bind:ref>
    {#snippet child({ props })}
        <Label
            {...props}
            class={cn("font-semibold", error && "text-red-400", className)}
        >
            {@render children?.()}
        </Label>
    {/snippet}
</FormPrimitive.Label>
