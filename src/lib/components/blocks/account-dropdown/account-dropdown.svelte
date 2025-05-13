<script lang="ts">
    import * as Avatar from "$ui/avatar";
    import { Button } from "$ui/button";
    import * as DropdownMenu from "$ui/dropdown-menu";
    import { Skeleton } from "$ui/skeleton";

    import LogOut from "@lucide/svelte/icons/log-out";
    import Settings from "@lucide/svelte/icons/settings";

    import { api, createQuery } from "$lib/hc";

    import { useUser } from "$lib/ctx";
    import { route } from "$lib/routes";

    const userQuery = createQuery({
        initialData: useUser(),
        endpoint: api.users.me,
    });
</script>

<div class="aspect-square w-full">
    <DropdownMenu.Root>
        <DropdownMenu.Trigger
            class="size-full grid place-items-center hover:bg-foreground/10"
        >
            <Avatar.CurrentUser />
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
                    <Avatar.CurrentUser class="mr-4" />
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
                        href={route("/account/settings")}
                    >
                        <Settings />Settings
                    </Button>
                </DropdownMenu.Group>

                <DropdownMenu.Separator />

                <Button
                    variant="destructive-ghost"
                    size="dropdown"
                    href={route("/auth/log-out")}
                >
                    <LogOut />Sign Out
                </Button>
            </DropdownMenu.Group>
        </DropdownMenu.Content>
    </DropdownMenu.Root>
</div>
