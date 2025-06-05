<script lang="ts">
    import type { Avatar as AvatarPrimitive } from "bits-ui";

    import { api, createBlobQuery } from "$lib/hc";

    import { LoadingSpinner } from "$ui/loading-spinner";

    import User from "@lucide/svelte/icons/user";

    import AvatarFallback from "./avatar-fallback.svelte";
    import AvatarImage from "./avatar-image.svelte";
    import Avatar from "./avatar.svelte";

    let {
        ref = $bindable(null),
        class: className = "",
        userId,

        ...rest
    }: AvatarPrimitive.RootProps & {
        userId: string;
    } = $props();

    const query = createBlobQuery({
        endpoint: api.assets.profilePicture[":user-id"],
        input: {
            param: {
                "user-id": userId,
            },
        },
    });
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
