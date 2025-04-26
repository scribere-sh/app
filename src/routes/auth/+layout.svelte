<script lang="ts">
    import type { LayoutProps } from "./$types";

    import { Scribere } from "$ui/logos";
    import { ThemeToggle } from "$ui/theme-toggle";

    const { children }: LayoutProps = $props();
</script>

<!--
    @component

    This is a wrapper component for the auth system that creates 
    a nice container setup.
-->

<header class="h-auth-header fixed top-0 left-0 w-screen">
    <div class="mx-auto flex h-full max-w-full flex-row items-center justify-between bg-transparent px-8 xl:max-w-screen-xl xl:px-0">
        <Scribere class="h-[50%]" />
    </div>
</header>

<main class="flex h-screen w-screen flex-col items-center justify-center">
    {@render children()}
</main>

<footer class="h-auth-footer fixed bottom-0 left-0 w-screen">
    <div class="mx-auto flex h-full max-w-full flex-row items-center justify-between bg-transparent px-8 xl:max-w-screen-xl xl:px-0">
        <div>&copy; Scribere 2025</div>
        <ThemeToggle />
    </div>
</footer>
