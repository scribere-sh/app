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
    <Card.Root class="w-65 h-55 flex flex-col">
        <Card.Header>
            <Card.Title class="group-hover:underline">{
                documentName
            }</Card.Title>
        </Card.Header>
        <Card.Content class="mt-auto">
            <div class="inline-flex flex-col gap-2">
                <a
                    href="#"
                    class="inline-flex items-center gap-2 no-underline hover:underline"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-users-icon lucide-users"
                    >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <circle cx="9" cy="7" r="4" />
                    </svg>
                    <p class="font-bold">{spaceName}</p>
                </a>

                <a
                    href="#"
                    class="inline-flex items-center gap-2 no-underline hover:underline"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-boxes-icon lucide-boxes"
                    >
                        <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" />
                        <path d="m7 16.5-4.74-2.85" />
                        <path d="m7 16.5 5-3" />
                        <path d="M7 16.5v5.17" />
                        <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" />
                        <path d="m17 16.5-5-3" />
                        <path d="m17 16.5 4.74-2.85" />
                        <path d="M17 16.5v5.17" />
                        <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" />
                        <path d="M12 8 7.26 5.15" />
                        <path d="m12 8 4.74-2.85" />
                        <path d="M12 13.5V8" />
                    </svg>
                    <p class="font-bold">{teamName}</p>
                </a>
            </div>
        </Card.Content>
    </Card.Root>
</a>
