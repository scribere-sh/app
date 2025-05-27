<script lang="ts">
    const { children } = $props();
</script>

<div class="w-sidebar h-sidebar aspect-square grid place-items-center">
    {@render children?.()}
</div>
