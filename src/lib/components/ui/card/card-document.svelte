<script lang="ts" module>
    export interface DescriptionProps {
        documentName: string;
        teamName: string;
        spaceName: string;
    }
</script>

<script lang="ts">
    import * as Card from ".";

    const {
        documentName,
        spaceName,
        teamName,
    }: DescriptionProps = $props();
</script>

<Card.Root class="w-60 h-55 bg-foreground/50 backdrop-blur-sm">
    <Card.Header>
        <Card.Title>{documentName}</Card.Title>
    </Card.Header>
    <Card.Content>
        <p>{spaceName}</p>
        <p>{teamName}</p>
    </Card.Content>
</Card.Root>
