<script lang="ts">
    import type { PageProps } from "./$types";

    import { Button } from "$ui/button";
    import * as Card from "$ui/card";

    import { route } from "$lib/routes";
    import LoginForm from "./form.svelte";

    const { data }: PageProps = $props();
    const { form, csrf } = data;
</script>

<Card.Root class="flex flex-row items-center gap-2 animate-in fade-in">
    <div class="w-96">
        <Card.Header>
            <Card.Title class="">
                Sign In
            </Card.Title>
            <Card.Description>
                Or use a provider if it is linked to your profile
            </Card.Description>
        </Card.Header>
        <Card.Content>
            <LoginForm {form} {csrf} />
        </Card.Content>
    </div>

    <div class="flex h-full flex-col items-center gap-2">
        <div class="bg-primary/25 mt-4 h-full w-px"></div>
        <span class="text-foreground/75 italic">or</span>
        <div class="bg-primary/25 mb-4 h-full w-px"></div>
    </div>

    <div class="flex w-96 flex-col items-center justify-center">
        oauth stuff
    </div>
</Card.Root>

<div class="mt-8 flex h-24 w-32 flex-col items-center justify-center gap-4">
    <Button
        href={route("/auth/register")}
        variant="link"
        class="text-background w-full"
    >
        Register
    </Button>

    <Button
        href={route("/auth/change-password")}
        variant="link"
        class="text-background w-full"
    >
        Forgot Password?
    </Button>
</div>
