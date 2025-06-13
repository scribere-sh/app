<script lang="ts">
    import type { PageProps } from "./$types";    

    import { api, createPutMutation, createQuery } from "$lib/hc";

    import { Button } from "$ui/button";
    import * as Card from "$ui/card";
    import LoadingSpinner from "$ui/loading-spinner";

    import Check from "@lucide/svelte/icons/check";
    import Edit from "@lucide/svelte/icons/edit";
    import X from "@lucide/svelte/icons/x";

    import { Editor } from "$lib/editor";

    import { toast } from "svelte-sonner";

    const {
        data
    }: PageProps = $props();

    let isEditing = $state(false);
    let docSnapshot: object | null = $state(null);
    let changedDocument: object | null = $state(null);

    const onupdate = (doc: object) => {
        changedDocument = doc;
    }

    const pageQuery = createQuery({
        endpoint: api.pages[':pageId'].content,
        input: {
            param: {
                pageId: data.pageId
            }
        },
    });

    const startEditing = () => {
        isEditing = true;
    };

    const submitUpdate = () => {
        isEditing = false;

        $pageUpdateMutation.mutate({
            param: {
                pageId: data.pageId,
            },
            json: {
                content: changedDocument!
            }
        });
    };

    const restoreSnapshot = () => {
        changedDocument = docSnapshot;
        isEditing = false;
    };

    const pageUpdateMutation = createPutMutation({
        endpoint: api.pages[':pageId'].update,
        onError: (err) => {
            console.error(err.message);
            toast.error("Error Occured During Update", {
                description: err.message,
            });
        },
        onSuccess: () => {
            isEditing = false;
            toast.success("Success", {
                description: "Updated Page",
            });
        },
    });

    pageQuery.subscribe((data) => {
        if (!docSnapshot) docSnapshot = data.data?.content ?? null;
        if (!changedDocument) changedDocument = data.data?.content ?? null;
    });
</script>

<h1 class="text-3xl mb-8">
    {#if $pageQuery.data}
        {$pageQuery.data.title}
    {:else}
        loading...
    {/if}
</h1>

<Card.Root class="w-full">
    <Card.Content class="flex flex-col items-end">
        {#if changedDocument}   
            {#key isEditing}
                <Editor active={isEditing} doc={changedDocument} {onupdate} />
            {/key}
        {:else}
            loading...
        {/if}

        {#if data.canEdit}
            {#if isEditing || $pageUpdateMutation.isPending}
                <Button
                    variant="ghost"
                    size="icon"
                    class="absolute -translate-x-[110%] z-50"
                    onclick={submitUpdate}
                >
                    {#if $pageUpdateMutation.isPending}
                        <LoadingSpinner />
                    {:else}
                        <Check class="text-green-500" />
                    {/if}
                </Button>

                <Button
                    variant="destructive-ghost"
                    size="icon"
                    class="absolute text-red-500 hover:text-foreground z-50"
                    onclick={restoreSnapshot}
                >
                    <X />
                </Button>
            {:else}
                <Button
                    variant="ghost"
                    size="icon"
                    class="absolute z-50"
                    onclick={startEditing}
                >
                    <Edit />
                </Button>
            {/if}
        {/if}

    </Card.Content>
</Card.Root>
