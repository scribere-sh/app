<script lang="ts">
    // import * as Accordion from "$ui/accordion";
    // import * as AlertDialog from "$ui/alert-dialog";
    // import Button, { buttonVariants } from "$ui/button";
    import { LoadingSpinner } from "$ui/loading-spinner";

    import { Document } from "$ui/card";

    import { api, createQuery } from "$lib/hc";

    const userQuery = createQuery({
        endpoint: api.users.me,
    });
</script>

<h1 class="text-left text-background text-6xl font-extrabold capitalize">
    {#if $userQuery.isSuccess}
        <span class="font-normal text-3xl">Welcome</span><br>{
            $userQuery.data.displayName
        }
    {:else if $userQuery.isError}
        {$userQuery.error.message}
    {:else}
        <LoadingSpinner class="size-10" />
    {/if}
</h1>

<h2 class="mt-10 font-semibold text-2xl text-background">Recent Documents</h2>

<Document />
