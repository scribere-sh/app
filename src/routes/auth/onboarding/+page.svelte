<script lang="ts">
    import type { PageProps } from "./$types";

    import * as Card from "$ui/card";
    import * as Tabs from "$ui/tabs";

    import Info from "@lucide/svelte/icons/info";

    import OnboardingForm, { type FocussableKey } from "./form.svelte";

    const { data }: PageProps = $props();
    const { form, challenge, csrf, email } = data;

    let focussed: FocussableKey = $state("display");

    const resolveTab = (focussed: FocussableKey): string => {
        if (["csrf", "email", "challenge"].includes(focussed)) {
            return "display";
        }
        if (["password", "confirm_password"].includes(focussed)) {
            return "password";
        }
        return focussed;
    };

    let tab = $derived(resolveTab(focussed));
</script>

<Card.Root class="flex flex-row items-start gap-2 animate-in fade-in">
    <div class="w-96">
        <Card.Header>
            <Card.Title>
                Finish Creating your Account
            </Card.Title>
            <Card.Description>
                Enter your details below to complete your registration
            </Card.Description>
        </Card.Header>
        <Card.Content>
            <OnboardingForm {form} {challenge} {csrf} {email} bind:focussed />
        </Card.Content>
    </div>

    <div class="flex h-full flex-col items-center gap-2">
        <div class="bg-primary/25 my-4 h-full w-px"></div>
    </div>

    <div class="flex w-96 flex-col items-center justify-center p-6">
        <Tabs.Root
            value={tab}
            onValueChange={(newVal) => focussed = newVal as FocussableKey}
            class="w-full"
        >
            <Tabs.List class="w-full mb-4">
                <Tabs.Trigger value="display">Display Name</Tabs.Trigger>
                <Tabs.Trigger value="handle">Handle</Tabs.Trigger>
                <Tabs.Trigger value="password">Password</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="display" class="prose dark:prose-invert">
                <h2 class="font-medium text-2xl mb-4 text-foreground brightness-110">
                    Display Name
                </h2>

                <p>
                    This is the name that will be shown within the UI. You can
                    make it whatever you'd like and can change it whenever you
                    want.
                </p>

                <ul>
                    <li>Can contain Uppercase & Lowercase Letters.</li>
                    <li>Can contain hyphens.</li>
                    <li>Can contain spaces.</li>
                    <li>Can be up to 50 letters long.</li>
                </ul>
            </Tabs.Content>
            <Tabs.Content value="handle" class="prose dark:prose-invert">
                <h2 class="font-medium text-2xl mb-4 text-foreground brightness-110">
                    Handle
                </h2>

                <p>
                    This is a quick and easy to type name that people can use to
                    find you. You can change it whenever you like but it must be
                    globally unique.
                </p>

                <ul>
                    <li>Can contain only lowercase letters.</li>
                    <li>Can contain hyphens, underscores, and periods.</li>
                    <li>
                        Can <strong class="text-foreground">not</strong> contain
                        spaces.
                    </li>
                    <li>Can be up to 50 letters long.</li>
                </ul>
            </Tabs.Content>

            <Tabs.Content value="password" class="prose dark:prose-invert">
                <h2 class="font-medium text-2xl mb-4 text-foreground brightness-110">
                    Password
                </h2>

                <p>
                    This is your password, you can (and should) change it every
                    now and then.
                </p>

                <ul>
                    <li>Can contain almost any characters</li>
                    <li>Must be at least 12 characters long</li>
                    <li>Should be random and un-guessable</li>
                </ul>

                <div class="flex flex-row items-center gap-6">
                    <Info class="size-12 stroke-blue-300" />
                    <p class="italic">
                        Your password will be securely checked against a
                        database of common or guessable passwords.
                        <a href="https://haveibeenpwned.com/Passwords"
                        >Learn More</a>
                    </p>
                </div>
            </Tabs.Content>
        </Tabs.Root>
    </div>
</Card.Root>
