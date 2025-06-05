<script lang="ts">
    import type { Avatar as AvatarPrimitive } from "bits-ui";

    import { api, createBlobQuery } from "$lib/hc";

    import { LoadingSpinner } from "$ui/loading-spinner";

    import User from "@lucide/svelte/icons/user";

    import AvatarFallback from "./avatar-fallback.svelte";
    import AvatarImage from "./avatar-image.svelte";
    import Avatar from "./avatar.svelte";

    const query = createBlobQuery({
        endpoint: api.assets.profilePicture.me,
    });

    let {
        ref = $bindable(null),
        class: className = "",

        ...rest
    }: AvatarPrimitive.RootProps = $props();
</script>

<Avatar
    bind:ref
    class={className}
    {...rest}
    loadingStatus={$query.isSuccess ? "loaded" : "loading"}
>
    {#if $query.isSuccess}
        <AvatarImage alt="profile picture" src={$query.data} />
    {:else if $query.isError}
        <AvatarFallback>
            <User />
        </AvatarFallback>
    {:else}
        <AvatarFallback>
            <LoadingSpinner />
        </AvatarFallback>
    {/if}
</Avatar>
