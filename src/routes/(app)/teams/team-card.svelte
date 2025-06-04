<script lang="ts" module>
    import type { CardTeam } from "$lib/schema/team";

    interface TeamCardProps {
        team: CardTeam;
    }
</script>

<script lang="ts">
    import type { IconProps } from "@lucide/svelte";
    import type { Component } from "svelte";

    import * as Avatar from "$ui/avatar";
    import * as Card from "$ui/card";

    import { initials } from "$lib/utils";

    import { route } from "$lib/routes";
    import BookOpenText from "@lucide/svelte/icons/book-open-text";
    import Users from "@lucide/svelte/icons/users";

    const {
        team,
    }: TeamCardProps = $props();

    const spaceCountRand = Math.ceil(Math.random() * 10);
</script>

{#snippet stat(Icon: Component<IconProps>, text: string)}
    <div class="flex gap-2 px-2">
        <Icon class="size-5 opacity-65" />
        <span class="text-sm">{text}</span>
    </div>
{/snippet}

<a
    href={route("/teams/[teamId=uid]", { teamId: team.id })}
    class="no-underline group"
>
    <Card.Root class="w-96 group-hover:bg-input/50">
        <Card.Header class="flex flex-row justify-between items-center">
            <div>
                <Card.Title class="group-hover:underline">
                    {team.displayName}
                </Card.Title>
                <Card.Description class="opacity-75 font-normal">
                    @{team.handle}
                </Card.Description>
            </div>

            <Avatar.Root>
                <Avatar.Fallback>
                    {initials(team.displayName)}
                </Avatar.Fallback>
            </Avatar.Root>
        </Card.Header>
        <Card.Content class="flex flex-row">
            {@render stat(
                    Users,
                    `${team.memberCount} Member${
                        Math.abs(team.memberCount) === 1
                            ? ""
                            : "s"
                    }`,
                )}
            {@render stat(
                    BookOpenText,
                    `${spaceCountRand} Space${
                        Math.abs(spaceCountRand) === 1 ? "" : "s"
                    }`,
                )}
        </Card.Content>
    </Card.Root>
</a>
