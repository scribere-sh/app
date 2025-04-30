<script lang="ts" module>
    import type { User } from "$lib/schema/user";

    export interface AccountDropdownProps {
        user: User;
    }
</script>

<script lang="ts">
    import * as Avatar from "$ui/avatar";
    import * as DropdownMenu from "$ui/dropdown-menu";
    import LoadingSpinner from "$ui/loading-spinner";

    import { api } from "$lib/hc";
    import { createQuery } from "@tanstack/svelte-query";

    const {
        user,
    }: AccountDropdownProps = $props();

    const userQuery = createQuery({
        queryKey: ["users", "me"],
        initialData: user,
        queryFn: async () => {
            const response = await api.users.me.$get();
            const out = await response.json();
            if (response.ok) return out;
            else throw out;
        },
    });
</script>

<div class="aspect-square w-full">
    <DropdownMenu.Root>
        <DropdownMenu.Trigger
            class="size-full grid place-items-center hover:bg-foreground/10"
        >
            <Avatar.Root>
                <Avatar.Fallback>
                    {#if $userQuery.data}
                        {
                            $userQuery.data.displayName
                            .split(" ").slice(0, 3).map(
                                s => s[0].toUpperCase(),
                            ).join("")
                        }
                    {:else}
                        <LoadingSpinner />
                    {/if}
                </Avatar.Fallback>
            </Avatar.Root>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
            side="right"
            align="end"
            alignOffset={6}
            sideOffset={10}
            class="w-80"
        >
            Hello
        </DropdownMenu.Content>
    </DropdownMenu.Root>
</div>
