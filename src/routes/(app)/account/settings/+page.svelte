<script lang="ts">
    import { cn } from "$lib/utils";
    import { setContext } from "svelte";

    import SectionDetails from "./section-details.svelte";
    import SectionEmails from "./section-emails.svelte";

    setContext(
        "cardClasses",
        cn("w-settings [scroll-margin-top:var(--spacing-content-top)]"),
    );
</script>

<SectionDetails />

<SectionEmails />
