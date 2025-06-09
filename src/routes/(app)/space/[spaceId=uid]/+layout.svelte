<script lang="ts">
    import type { LayoutProps } from "./$types";

    const {
        children
    }: LayoutProps = $props();
</script>

<div class="ml-sidebar w-[calc(100%-var(--spacing-sidebar))] flex flex-row">
    <aside>
        
    </aside>
    <div>
        {@render children()}
    </div>
</div>

