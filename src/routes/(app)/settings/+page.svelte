<script lang="ts">
    // import { createQuery } from '@tanstack/svelte-query';
    import { api, createQuery } from "$lib/hc";

    import * as Avatar from "$ui/avatar";
    import * as Card from "$ui/card";
    import { LoadingSpinner } from "$ui/loading-spinner";

    import { cn, initials } from "$lib/utils";
    import { Skeleton } from "$ui/skeleton";

    const userQuery = createQuery({
        endpoint: api.users.me,
    });
    const detailsQuery = createQuery({
        endpoint: api.account.details,
    });

    const cardClasses = cn(
        "w-settings [scroll-margin-top:var(--spacing-content-top)]",
    );

    const userInitials = $userQuery.data
        ? initials($userQuery.data.displayName)
        : null;
</script>

<Card.Root id="details" class={cn(cardClasses, "flex flex-row items-center")}>
    <Card.Content class="w-1/3 flex flex-col justify-between">
        <Avatar.Root class="w-full h-max aspect-square">
            <Avatar.Fallback>
                {#if userInitials}
                    {userInitials}
                {:else}
                    <LoadingSpinner />
                {/if}
            </Avatar.Fallback>
        </Avatar.Root>

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

    <Card.Content class="w-2/3">
        <div>PFP</div>
        <div>Display Name</div>
        <div>Handle</div>
    </Card.Content>
</Card.Root>

<Card.Root id="emails" class={cn(cardClasses)}>
    <Card.Header>
        <Card.Title>
            Email Address
        </Card.Title>
    </Card.Header>
    <Card.Content class="h-96 grid place-items-center">
        {#if $detailsQuery.data}
            <pre class="w-[80%]">{JSON.stringify($detailsQuery.data, null, 4)}</pre>
        {/if}
    </Card.Content>
</Card.Root>
