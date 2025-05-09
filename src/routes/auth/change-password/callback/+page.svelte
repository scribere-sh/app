<script lang="ts">
    import type { PageProps } from "./$types";

    import { Button } from "$ui/button";
    import * as Card from "$ui/card";

    import ChangePasswordForm from "./form.svelte";

    import { route } from "$lib/routes";

    const {
        data,
    }: PageProps = $props();

    const {
        form,
        csrf,
        id,
        challenge,
    } = data;
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>
            Change Password
        </Card.Title>
        <Card.Description>
            Enter a new password below
        </Card.Description>
    </Card.Header>
    <Card.Content class="w-96">
        <ChangePasswordForm {form} {csrf} {id} {challenge} />
    </Card.Content>
</Card.Root>

<div class="mt-8 flex h-24 w-32 flex-col items-center justify-center gap-4">
    <Button
        href={route("/auth/sign-in")}
        variant="link"
        class="text-foreground w-full"
    >
        Sign In
    </Button>
</div>
