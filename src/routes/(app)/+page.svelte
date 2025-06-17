<script lang="ts">
    // import * as Accordion from "$ui/accordion";
    // import * as AlertDialog from "$ui/alert-dialog";
    // import Button, { buttonVariants } from "$ui/button";
    import { LoadingSpinner } from "$ui/loading-spinner";

    // import { Document } from "$ui/card";

    import { api, createQuery } from "$lib/hc";

    const userQuery = createQuery({
        endpoint: api.users.me,
    });
</script>

<h1 class="text-left text-background text-7xl font-extrabold capitalize w-page">
    {#if $userQuery.isSuccess}
        <span class="font-normal text-4xl">Welcome</span><br>{
            $userQuery.data.displayName
        }
    {:else if $userQuery.isError}
        {$userQuery.error.message}
    {:else}
        <LoadingSpinner class="size-10" />
    {/if}
</h1>

<h2 class="my-10 font-semibold text-3xl text-background w-page">
    Recent Documents
</h2>

<div class="flex flex-wrap gap-18 justify-between mb-24 w-page">
    <!--
        <Document
            documentName="Document Name"
            teamName="Team Name"
            spaceName="Space Name"
        />
    -->
</div>
