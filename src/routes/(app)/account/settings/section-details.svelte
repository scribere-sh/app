<script lang="ts">
    import * as Avatar from "$ui/avatar";
    import * as Card from "$ui/card";

    import { api, createQuery } from "$lib/hc";

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

    const cardClasses = getContext<string>("cardClasses");
</script>

<Card.Root id="details" class={cn(cardClasses, "flex flex-row items-center")}>
    <Card.Content class="w-1/3 flex flex-col justify-between ml-4">
        <Avatar.CurrentUser class="w-full h-max aspect-square my-4" />

        <div class="flex flex-col gap-2">
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
        <FormProfilePicture />
        <FormDisplayName current={user.displayName} />
        <FormHandle current={user.handle} />
    </Card.Content>
</Card.Root>
