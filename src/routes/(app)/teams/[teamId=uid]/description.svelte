<script lang="ts" module>

    export interface DescriptionProps {
        description: object
    }
</script>

<script lang="ts">
    import { Editor } from "$lib/editor";

    let {
        description
    }: DescriptionProps = $props();
</script>

<Editor doc={description} active />
