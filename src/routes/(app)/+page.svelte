<script lang="ts">
    import * as Accordion from "$ui/accordion";
    import * as AlertDialog from "$ui/alert-dialog";
    import Button, { buttonVariants } from "$ui/button";
    import LoadingSpinner from "$ui/loading-spinner";

    import { mode, setTheme, theme, toggleMode } from "mode-watcher";

    import { api, createQuery } from "$lib/hc";

    const userQuery = createQuery({
        endpoint: api.users.me,
    });
</script>

<h1 class="text-foreground text-4xl font-extrabold capitalize">
    {#if $userQuery.isSuccess}
        Welcome to SvelteKit - {$userQuery.data.displayName}
    {:else if $userQuery.isError}
        {$userQuery.error.message}
    {:else}
        <LoadingSpinner class="size-10" />
    {/if}
</h1>

<div class="mt-4 flex flex-row gap-4">
    <Button class="capitalize" tabindex={0} onclick={toggleMode}>
        Let there be {
            mode.current
            ? (mode.current === "dark" ? "light" : "darkness")
            : "..."
        }
    </Button>

    <Button
        class="capitalize"
        onclick={() => {
            setTheme(theme.current === "gruvbox" ? "default" : "gruvbox");
        }}
    >
        Gruvbox? - {theme.current === "gruvbox" ? "yes" : "no"}
    </Button>

    <AlertDialog.Root>
        <AlertDialog.Trigger class={buttonVariants()}
        >Alert</AlertDialog.Trigger>

        <AlertDialog.Content>
            <AlertDialog.Header>
                <AlertDialog.Title>Alert</AlertDialog.Title>
                <AlertDialog.Description>Sentry Ahead</AlertDialog.Description>
            </AlertDialog.Header>
            <div class="grid aspect-square place-items-center">
                <img
                    src="https://vignette.wikia.nocookie.net/teamfortress/images/e/e0/Soldier_with_the_Stainless_Pot_TF2.png/revision/latest?cb=20130803193645"
                    alt="soldier tf2"
                />
            </div>
            <AlertDialog.Footer>
                <AlertDialog.Cancel variant="outline">
                    <span class="font-extrabold">R.I.P</span> Rick May
                </AlertDialog.Cancel>
            </AlertDialog.Footer>
        </AlertDialog.Content>
    </AlertDialog.Root>
</div>

<div class="flex h-[300px] w-[500px] items-center justify-center">
    <Accordion.Root type="single" class="w-full sm:max-w-[70%]">
        <Accordion.Item value="item-1">
            <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
            <Accordion.Content>Yes. It adheres to the WAI-ARIA design
                pattern.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
            <Accordion.Trigger>Is it styled?</Accordion.Trigger>
            <Accordion.Content>
                Yes. It comes with default styles that matches the other
                components' aesthetic.
            </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-3">
            <Accordion.Trigger>Is it animated?</Accordion.Trigger>
            <Accordion.Content>
                Yes. It's animated by default, but you can disable it if you
                prefer.
            </Accordion.Content>
        </Accordion.Item>
    </Accordion.Root>
</div>

<p>
    Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read
    the documentation
</p>

{#if $userQuery.isSuccess}
    <pre class="font-mono">{JSON.stringify($userQuery.data, null, 4)}</pre>
{/if}
