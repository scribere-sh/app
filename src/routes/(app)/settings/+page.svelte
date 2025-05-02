<script lang="ts">
    import type { PageProps } from "./$types";

    import { cn } from "$lib/utils";
    import { setContext } from "svelte";

    import SectionDetails from "./section-details.svelte";

    const {
        data,
    }: PageProps = $props();

    setContext("csrf", data.csrf);
    setContext(
        "cardClasses",
        cn("w-settings [scroll-margin-top:var(--spacing-content-top)]"),
    );
</script>

<SectionDetails details={data.details} />
