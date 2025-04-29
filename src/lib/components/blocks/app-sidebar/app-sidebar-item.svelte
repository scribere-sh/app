<script lang="ts">
    const { children } = $props();
</script>

<div class="w-full aspect-square grid place-items-center">
    {@render children?.()}
</div>
