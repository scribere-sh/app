<script lang="ts">
    import { Button, type ButtonProps } from "$ui/button";

    let { ref = $bindable(null), ...rest }: ButtonProps = $props();
</script>

<Button bind:ref type="submit" {...rest} />
