<script lang="ts" module>
    export interface DescriptionProps {
        documentName: string;
        teamName: string;
        spaceName: string;
        // teamId: string;
        // spaceId: string;
        // pageId: string;
    }
</script>

<script lang="ts">
    import * as Card from ".";

    import Boxes from "@lucide/svelte/icons/boxes";
    import Users from "@lucide/svelte/icons/users";

    const {
        documentName,
        spaceName,
        teamName,
        // teamId,
        // spaceId,
        // pageId
    }: DescriptionProps = $props();
</script>
<a href="#" class="no-underline group">
    <Card.Root class="w-65 flex flex-col hover:bg-foreground/100">
        <Card.Header>
            <Card.Title class="group-hover:underline">{
                documentName
            }</Card.Title>
        </Card.Header>
        <Card.Content class="mt-8">
            <div class="inline-flex flex-col gap-2">
                <a
                    href="#"
                    class="inline-flex items-center gap-2 no-underline hover:underline"
                >
                    <Users />
                    <p class="font-bold">{spaceName}</p>
                </a>

                <a
                    href="#"
                    class="inline-flex items-center gap-2 no-underline hover:underline"
                >
                    <Boxes />
                    <p class="font-bold">{teamName}</p>
                </a>
            </div>
        </Card.Content>
    </Card.Root>
</a>
