<script lang="ts">
    import { api, createDeleteMutation, createPostMutation, createQuery } from "$lib/hc";
    import type { Permission } from "$lib/schema/permission";

    import Button from "$ui/button";
    import * as Card from "$ui/card";
    import { Input } from "$ui/input";
    import { Separator } from "$ui/separator";

    import Trash from "@lucide/svelte/icons/trash-2";

    import PermissionToggle from "./permission-toggle.svelte";

    const {
        teamId
    }: {
        teamId: string
    } = $props();

    let addUserInput = $state("");
    let addUserInputValid = $derived(addUserInput.length > 3);

    const permissions = [
        "space:read",
        "space:write",
        "team:update"
    ];

    const teamPermissionsQuery = createQuery({
        endpoint: api.teams.userPermissions,
        input: {
            query: {
                team: teamId
            }
        }
    });

    const removeUserMutation = createDeleteMutation({
        endpoint: api.teams.removeUser,
        onSettled: () => {
            $teamPermissionsQuery.refetch()
        }
    });

    const deleteUser = (userId: string) => {
        $removeUserMutation
            .mutate({
                query: {
                    team: teamId
                },
                json: {
                    user: userId
                }
            });
    };

    const addUserMutation = createPostMutation({
        endpoint: api.teams.addUser,
        onSettled: () => {
            $teamPermissionsQuery.refetch()
        }
    });

    const addUser = () => {
        if (!addUserInputValid) return;

        addUserInput = "";

        $addUserMutation
            .mutate({
                query: {
                    team: teamId
                },
                json: {
                    identifier: addUserInput
                }
            });
    }
</script>

<Card.Root class="w-page">
    <Card.Header>
        <Card.Title>
            User Management
        </Card.Title>
    </Card.Header>
    <Card.Content>
        {#if $teamPermissionsQuery.data}
            {@const users = $teamPermissionsQuery.data}
            <table class="w-full">
                <thead>
                    <tr>
                        <th scope="col" class="h-12 w-full text-left">User</th>
                        {#each permissions as perm (perm)}
                            <th scope="col" class="h-12 w-min px-2">{perm}</th>
                        {/each}
                        <th scope="col" class="h-12 w-min px-2">Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {#each users as user (user.id)}
                        <tr>
                            <td>{user.displayName} <span class="text-xs opacity-50 ml-1">@{user.handle}</span></td>
                            {#each permissions as perm (perm)}
                                <td class="h-12 text-center">
                                    <PermissionToggle {teamId} userId={user.id} permission={perm} enabled={user.permissions.includes(perm as Permission)} />
                                </td>
                            {/each}
                            <td class="h-12 text-center">
                                <Button variant="destructive-ghost" class="group" onclick={() => deleteUser(user.id)}>
                                    <Trash class="text-red-500 group-hover:text-white" />
                                </Button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
        
        <Separator orientation="horizontal" class="w-full my-4 bg-background/10" />

        <div class="w-full flex flex-row gap-4">
            <Input bind:value={addUserInput} class="w-1/3" />
            <Button disabled={!addUserInputValid} onclick={addUser}>
                Add User
            </Button>
        </div>
    </Card.Content>
</Card.Root>
