<script lang="ts" module>
    export interface SpaceProps {
        spaceName: string;
        spaceId: string;
        homePageId: string;
        pageCount: number;
        lastUpdated: Date;
    }
</script>

<script lang="ts">
    import BookOpen from "@lucide/svelte/icons/book-open";
    import ClockPlus from "@lucide/svelte/icons/clock-plus";
    import * as Card from ".";

    import { route } from "$lib/routes";
    import humantime from "humantime";

    const {
        spaceName,
        spaceId,
        homePageId,
        pageCount,
        lastUpdated,
    }: SpaceProps = $props();
</script>

<a
    href={route("/space/[spaceId=uid]/page/[pageId=uid]", {
        spaceId: spaceId,
        pageId: homePageId,
    })}
    class="no-underline group w-65 block"
>
    <Card.Root class="size-full flex flex-col hover:bg-foreground/100">
        <Card.Header>
            <Card.Title class="group-hover:underline">{spaceName}</Card.Title>
        </Card.Header>
        <Card.Content class="mt-6">
            <div class="inline-flex flex-col gap-2">
                <div class="inline-flex items-center gap-2 no-underline hover:underline">
                    <BookOpen />
                    <p class="font-bold">{pageCount}</p>
                </div>

                <div class="inline-flex items-center gap-2 no-underline hover:underline">
                    <ClockPlus />
                    <p class="font-bold">{humantime(lastUpdated)}</p>
                </div>
            </div>
        </Card.Content>
    </Card.Root>
</a>
