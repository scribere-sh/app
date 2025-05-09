<script lang="ts">
    import { getContext } from "svelte";

    import * as Card from "$ui/card";

    import { api, createQuery } from "$lib/hc";
    import { cn } from "$lib/utils";
    import LoadingSpinner from "$ui/loading-spinner";

    import Check from "@lucide/svelte/icons/check";
    import X from "@lucide/svelte/icons/x";

    const detailsQuery = createQuery({
        endpoint: api.account.details,
    });

    const cardClasses = getContext<string>("cardClasses");

    const censorEmail = (email: string): string => {
        const atSymbolPos = email.indexOf("@");

        return email[0]
            .concat(
                "*".repeat(atSymbolPos - 1),
            )
            .concat(
                email.substring(atSymbolPos),
            );
    };
</script>

<Card.Root id="emails" class={cn(cardClasses)}>
    <Card.Header>
        <Card.Title>Email Address</Card.Title>
    </Card.Header>
    <Card.Content class="flex flex-col gap-2">
        <div class="flex flex-row items-center justify-between py-4 mx-4 border-b border-b-foreground/10">
            <div class="font-bold">Current Account Email Address</div>

            {#if $detailsQuery.isPending}
                <LoadingSpinner />
            {:else if $detailsQuery.isSuccess}
                <div class="flex flex-row items-center gap-2">
                    <Check class="stroke-green-500 size-4" />{
                        censorEmail(
                            $detailsQuery.data.emailAddress,
                        )
                    }
                </div>
            {:else if $detailsQuery.isError}
                <X class="stroke-red-500" />
            {/if}
        </div>
        <div class="flex justify-center items-center mx-4 py-4">
            todo - update email
        </div>
    </Card.Content>
</Card.Root>
