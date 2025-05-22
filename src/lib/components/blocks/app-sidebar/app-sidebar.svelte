<script lang="ts">
    import { AccountDropdown } from "$blk/account-dropdown";
    import { ThemeToggle } from "$blk/theme-toggle";

    import { Scribere } from "$ui/logos";

    import { route } from "$lib/routes";

    import AppSidebarItem from "./app-sidebar-item.svelte";
</script>

<header class="z-3 fixed top left bg-background w-sidebar h-screen flex flex-col items-center justify-center border-r-2 text-foreground">
    <a href={route("/")} class="hover:bg-foreground/10">
        <AppSidebarItem>
            <Scribere class="w-1/2" />
        </AppSidebarItem>
    </a>

    <span class="flex-[1_1_auto]">
        <!--
            This is a separator, everything above this is pushed to the top
            everything below is pushed to the bottom
        -->
    </span>

    <AppSidebarItem>
        <ThemeToggle expand side="right" align="center" sideOffset={10} />
    </AppSidebarItem>

    <AccountDropdown />
</header>
