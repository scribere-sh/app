<script lang="ts">
    import type { WithoutChildren } from "bits-ui";
    import type { ButtonProps } from ".";

    import Button from "./button.svelte";

    const {
        testString,
        ...rest
    }: WithoutChildren<ButtonProps> & {
        testString?: string;
    } = $props();
</script>

<Button {...rest}>
    {testString}
</Button>
