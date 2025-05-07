<script lang="ts" module>
    import type { PageData } from "./$types";

    export interface SectionDetailsProps {
        details: PageData["details"];
    }
</script>

<script lang="ts">
    import { api, createQuery } from "$lib/hc";

    import * as Avatar from "$ui/avatar";
    import * as Card from "$ui/card";

    import FormDisplayName from "./form-display-name.svelte";
    import FormHandle from "./form-handle.svelte";
    import FormProfilePicture from "./form-profile-picture.svelte";

    import { useUser } from "$lib/ctx";
    import { cn } from "$lib/utils";
    import { Skeleton } from "$ui/skeleton";
    import { getContext } from "svelte";

    const user = useUser();

    const userQuery = createQuery({
        initialData: user,
        endpoint: api.users.me,
    });

    const detailsQuery = createQuery({
        endpoint: api.account.details,
    });

    const cardClasses = getContext<string>("cardClasses");

    const { details }: SectionDetailsProps = $props();
</script>

<Card.Root id="details" class={cn(cardClasses, "flex flex-row items-center")}>
    <Card.Content class="w-1/3 flex flex-col justify-between">
        <Avatar.CurrentUser class="w-full h-max aspect-square" />

        <div class="flex flex-col gap-2 mt-4">
            {#if $userQuery.data}
                <span class="text-2xl">{$userQuery.data.displayName}</span>
                <span class="text-foreground/70">@{
                        $userQuery.data.handle
                    }</span>
            {:else}
                <Skeleton class="w-full h-8" />
                <Skeleton class="w-2/3 h-6" />
            {/if}
        </div>
    </Card.Content>

    <Card.Content class="w-2/3 flex flex-col gap-6 justify-center">
        <FormProfilePicture form={details.updateProfilePicutreForm} />
        <FormDisplayName form={details.updateDisplayNameForm} />
        <FormHandle form={details.updateHandleForm} />
    </Card.Content>
</Card.Root>

<Card.Root id="emails" class={cn(cardClasses)}>
    <Card.Header>
        <Card.Title>Email Address</Card.Title>
    </Card.Header>
    <Card.Content class="h-96 grid place-items-center">
        {#if $detailsQuery.data}
            <pre class="w-[80%]">
{JSON.stringify(
                    $detailsQuery.data,
                    null,
                    4,
                )}</pre>
        {/if}
    </Card.Content>
</Card.Root>
