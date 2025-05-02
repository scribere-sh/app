<script lang="ts" module>
    import type { User } from "$lib/schema/user";

    export interface AccountDropdownProps {
        user: User;
    }
</script>

<script lang="ts">
    import * as Avatar from "$ui/avatar";
    import { Button } from "$ui/button";
    import * as DropdownMenu from "$ui/dropdown-menu";
    import LoadingSpinner from "$ui/loading-spinner";
    import { Skeleton } from "$ui/skeleton";

    import LogOut from "@lucide/svelte/icons/log-out";
    import Settings from "@lucide/svelte/icons/settings";

    import { api, createQuery } from "$lib/hc";

    import { route } from "$lib/routes";
    import { initials } from "$lib/utils";

    const {
        user,
    }: AccountDropdownProps = $props();

    const userQuery = createQuery({
        initialData: user,
        endpoint: api.users.me,
    });

    const userInitials = $derived(
        $userQuery.data
            ? initials($userQuery.data.displayName)
            : null,
    );
</script>

<div class="aspect-square w-full">
    <DropdownMenu.Root>
        <DropdownMenu.Trigger
            class="size-full grid place-items-center hover:bg-foreground/10"
        >
            <Avatar.Root>
                <Avatar.Fallback>
                    {#if userInitials}
                        {userInitials}
                    {:else}
                        <LoadingSpinner />
                    {/if}
                </Avatar.Fallback>
                <Avatar.CurrentUser />
            </Avatar.Root>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
            side="right"
            align="end"
            alignOffset={6}
            sideOffset={10}
            class="w-80"
        >
            <DropdownMenu.Group>
                <Button
                    href={route("/")}
                    variant="ghost"
                    class="w-full h-min p-4 gap-0 flex flex-row no-underline"
                >
                    <Avatar.Root class="mr-4">
                        <Avatar.Fallback>
                            {#if userInitials}
                                {userInitials}
                            {:else}
                                <LoadingSpinner />
                            {/if}
                        </Avatar.Fallback>
                        <Avatar.CurrentUser />
                    </Avatar.Root>
                    <div class="flex flex-col w-full gap-1">
                        {#if $userQuery.data}
                            <span class="font-bold">{
                                $userQuery.data
                                .displayName
                            }</span>
                            <span class="opacity-80 text-sm">@{
                                    $userQuery.data
                                    .handle
                                }</span>
                        {:else}
                            <Skeleton class="h-3 my-1 w-2/3" />
                            <Skeleton class="h-3 my-1 w-1/3" />
                        {/if}
                    </div>
                </Button>

                <DropdownMenu.Separator />

                <DropdownMenu.Group>
                    <DropdownMenu.GroupHeading>
                        Account
                    </DropdownMenu.GroupHeading>

                    <Button
                        variant="ghost"
                        size="dropdown"
                        href={route("/settings")}
                    >
                        <Settings />Settings
                    </Button>
                </DropdownMenu.Group>

                <DropdownMenu.Separator />

                <Button
                    variant="destructive-ghost"
                    size="dropdown"
                    href={route("/")}
                >
                    <LogOut />Sign Out
                </Button>
            </DropdownMenu.Group>
        </DropdownMenu.Content>
    </DropdownMenu.Root>
</div>
