<script lang="ts" module>
    // import type { PageData } from "./$types";

    // interface CreateSpaceProps {
    //     teamId: PageData['teamId']
    // }
</script>

<script lang="ts">
    import * as AlertDialog from "$ui/alert-dialog";
    import { buttonVariants } from "$ui/button";

    import Plus from "@lucide/svelte/icons/plus";

    // const {
    //     teamId
    // }: CreateSpaceProps = $props();
</script>

<AlertDialog.Root>
    <AlertDialog.Trigger class={buttonVariants({ size: "lg" })}>
        <Plus /> Create Space
    </AlertDialog.Trigger>
    <AlertDialog.Content>
        <AlertDialog.Header>
            
        </AlertDialog.Header>
    </AlertDialog.Content>
</AlertDialog.Root>

