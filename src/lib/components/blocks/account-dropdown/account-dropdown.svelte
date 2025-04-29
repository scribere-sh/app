<script lang="ts" module>
    import type { User } from "$lib/schema/user";

    export interface AccountDropdownProps {
        user: User;
    }
</script>

<script lang="ts">
    import * as Avatar from "$ui/avatar";
    import * as DropdownMenu from "$ui/dropdown-menu";

    const {
        user,
    }: AccountDropdownProps = $props();

    const userInitials = $derived(
        user.displayName.split(" ").slice(0, 3).map(s =>
            s[0].toUpperCase()
        ).join(""),
    );
</script>

<div class="aspect-square w-full">
    <DropdownMenu.Root>
        <DropdownMenu.Trigger
            class="size-full grid place-items-center hover:bg-foreground/10"
        >
            <Avatar.Root>
                <Avatar.Fallback>
                    {userInitials}
                </Avatar.Fallback>
            </Avatar.Root>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
            side="right"
            align="end"
            alignOffset={4}
            sideOffset={6}
            class="w-80"
        >
            Hello
        </DropdownMenu.Content>
    </DropdownMenu.Root>
</div>
