<script lang="ts">
    // import * as Accordion from "$ui/accordion";
    // import * as AlertDialog from "$ui/alert-dialog";
    // import Button, { buttonVariants } from "$ui/button";
    import LoadingSpinner from "$ui/loading-spinner";

    import { api, createQuery } from "$lib/hc";

    const userQuery = createQuery({
        endpoint: api.users.me,
    });
</script>

<h1 class="text-left text-foreground text-4xl font-extrabold capitalize">
    {#if $userQuery.isSuccess}
        Welcome {$userQuery.data.displayName}
    {:else if $userQuery.isError}
        {$userQuery.error.message}
    {:else}
        <LoadingSpinner class="size-10" />
    {/if}
</h1>
