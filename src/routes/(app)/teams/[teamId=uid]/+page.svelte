<script lang="ts">
    import type { PageProps } from "./$types";

    import * as Accordion from "$ui/accordion";
    import * as Avatar from "$ui/avatar";
    import * as Card from "$ui/card";
    import { Skeleton } from "$ui/skeleton";
    import * as Tabs from "$ui/tabs";

    import Hourglass from "@lucide/svelte/icons/hourglass";

    import { api, createQuery } from "$lib/hc";
    
    import Description from "./description.svelte";

    const { data }: PageProps = $props();

    const teamQuery = createQuery({
        endpoint: api.teams.getTeamDetails,
        input: {
            query: {
                team: data.teamId,
            },
        },
    });    
</script>

<main class="w-page flex flex-col items-start justify-center gap-2">
    {#if $teamQuery.isSuccess}
        <h1 class="text-4xl w-full font-bold">{$teamQuery.data.displayName}</h1>
        <h2 class="text-2xl w-full opacity-65">@{$teamQuery.data.handle}</h2>
    {:else}
        <Skeleton class="w-2/3 h-9 mt-[--spacing(calc(2/2.5))]" />
        <Skeleton class="w-1/2 h-6 mt-[--spacing(calc(2/1.5))]" />
    {/if}

    <Tabs.Root value="home" class="w-full mt-4">
        <Tabs.List class="w-2/3">
            <Tabs.Trigger value="home">Home</Tabs.Trigger>
            <Tabs.Trigger value="spaces">Spaces</Tabs.Trigger>
            <Tabs.Trigger value="files">Files</Tabs.Trigger>
        </Tabs.List>

        <div class="mt-8 w-full">
            <Tabs.Content value="home">
                <Card.Root class="w-full">
                    <Card.Header>
                        <Card.Title>Description</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        {#if $teamQuery.isSuccess}
                            <Description description={$teamQuery.data.description} />
                        {:else}
                            <Skeleton class="w-2/3 h-6" />
                        {/if}
                    </Card.Content>
                </Card.Root>

                <div class="flex flex-row justify-between gap-8 mt-8">
                    <Card.Root class="w-3/5 h-min">
                        <Card.Header>
                            <Card.Title>Recent Updates</Card.Title>
                        </Card.Header>
                        <Card.Content>
                            <Accordion.Root type="single" class="w-full">
                                <Accordion.Item value="item-1">
                                    <Accordion.Trigger>Alert</Accordion.Trigger>
                                    <Accordion.Content
                                        >Yo mama</Accordion.Content
                                    >
                                </Accordion.Item>
                            </Accordion.Root>
                        </Card.Content>
                    </Card.Root>

                    <Card.Root class="w-2/5 h-min">
                        <Card.Header>
                            <Card.Title>Members &amp; Status</Card.Title>
                            <Card.Content class="px-0">
                                {#if $teamQuery.isSuccess}
                                    {#each $teamQuery.data.members as member (member.id)}
                                        <div
                                            class="w-full h-16 flex flex-row gap-4 items-center not-last:border-b-[1px] not-last:border-b-foreground/20"
                                        >
                                            <Avatar.AvatarForUser
                                                userId={member.id}
                                            />
                                            <div class="flex flex-col w-full">
                                                <span>{member.displayName}</span
                                                >
                                                <span class="opacity-65"
                                                    >@{member.handle}</span
                                                >
                                            </div>
                                            <div
                                                class="flex flex-col items-center justify-center gap-1 h-full opacity-75 shrink-0"
                                            >
                                                <Hourglass class="size-4" />
                                                {member.activity.time}m
                                            </div>
                                        </div>
                                    {/each}
                                {:else}
                                    <div
                                        class="w-full h-16 flex flex-row gap-4 items-center not-last:border-b-[1px] not-last:border-b-foreground/20"
                                    >
                                        <Skeleton
                                            class="size-10 rounded-full shrink-0"
                                        />
                                        <div class="flex flex-col w-full">
                                            <Skeleton class="w-1/2 h-4" />
                                            <Skeleton class="w-1/3 h-4 mt-2" />
                                        </div>
                                        <div
                                            class="flex flex-col items-center justify-center gap-1 h-full opacity-75 shrink-0"
                                        >
                                            <Hourglass class="size-4" />
                                            <Skeleton class="w-8 h-4 mt-2" />
                                        </div>
                                    </div>
                                {/if}
                            </Card.Content>
                        </Card.Header>
                    </Card.Root>
                </div>
            </Tabs.Content>
        </div>
    </Tabs.Root>
</main>
