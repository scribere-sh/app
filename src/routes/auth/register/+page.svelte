<script lang="ts">
    import type { PageProps } from "./$types";

    import { Button } from "$ui/button";
    import * as Card from "$ui/card";

    import RegisterForm from "./form.svelte";

    import { route } from "$lib/routes";
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";

    let { data }: PageProps = $props();
    const { form, csrf, accepting } = data;

    onMount(() => {
        if (!accepting) {
            const toastId = toast.warning(
                "Scribere is not currently accepting registrations",
                {
                    duration: Number.POSITIVE_INFINITY,
                    position: "top-center",
                },
            );

            // remove the toast on other pages
            // return this on destroy
            return () => {
                toast.dismiss(toastId);
            };
        }
    });
</script>

<!-- even out the spacing -->
<div class="h-24"></div>

<Card.Root class="animate-in fade-in">
    <Card.Header>
        <Card.Title>Register</Card.Title>
        <Card.Description>Enter your email address below to get
            started</Card.Description>
    </Card.Header>
    <Card.Content>
        <RegisterForm {form} {csrf} {accepting} />
    </Card.Content>
</Card.Root>

<div class="mt-8 flex h-24 w-32 flex-col items-center justify-center gap-4">
    <Button
        href={route("/auth/sign-in")}
        variant="link"
        class="text-foreground w-full"
    >Sign In</Button>
</div>
