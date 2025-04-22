<script lang="ts">
	import * as Accordion from '$ui/accordion';
	import * as AlertDialog from '$ui/alert-dialog';
	import Button, { buttonVariants } from '$ui/button';
	import LoadingSpinner from '$ui/loading-spinner';

	import { toggleMode, mode } from 'mode-watcher';

	import { eden } from '$lib/eden';

	const ping = eden.ping.get.createQuery();
</script>

<div class="prose dark:prose-invert">
	{#if $ping.isSuccess}
		<h1>Welcome to SvelteKit</h1>
	{:else if $ping.isError}
		<h1>Failed to Ping</h1>
	{:else}
		<h1>
			<LoadingSpinner class="size-10" />
		</h1>
	{/if}
</div>

<div class="mt-4 flex flex-row gap-4">
	<Button class="capitalize" tabindex={0} onclick={toggleMode}
		>Let there be {mode.current === 'dark' ? 'light' : 'darkness'}</Button
	>

	<AlertDialog.Root>
		<AlertDialog.Trigger class={buttonVariants()}>Alert</AlertDialog.Trigger>

		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Alert</AlertDialog.Title>
				<AlertDialog.Description>Sentry Ahead</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel variant="outline">👍</AlertDialog.Cancel>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>

<div class="flex h-[300px] w-[500px] items-center justify-center">
	<Accordion.Root type="single" class="w-full sm:max-w-[70%]">
		<Accordion.Item value="item-1">
			<Accordion.Trigger>Is it accessible?</Accordion.Trigger>
			<Accordion.Content>Yes. It adheres to the WAI-ARIA design pattern.</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value="item-2">
			<Accordion.Trigger>Is it styled?</Accordion.Trigger>
			<Accordion.Content>
				Yes. It comes with default styles that matches the other components' aesthetic.
			</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value="item-3">
			<Accordion.Trigger>Is it animated?</Accordion.Trigger>
			<Accordion.Content>
				Yes. It's animated by default, but you can disable it if you prefer.
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>

<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
