<script lang="ts" module>
	import type { PageData } from './$types';

	export interface FormProps {
		form: PageData['form'];
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	import { toast } from 'svelte-sonner';

	import * as Form from '$ui/form';
	import { Input } from '$ui/input';

	import LoadingSpinner from '$ui/loading-spinner';
	import { cn } from '$lib/utils';
	import { route } from '$lib/routes';

	let firstFieldRef: HTMLElement | null = $state(null);

	$effect(() => {
		if (firstFieldRef) firstFieldRef.focus();
	});

	let { form: _form, disabled = $bindable(false) }: FormProps = $props();

	const form = superForm(_form, {
		onSubmit: () => {
			disabled = true;
		},
		onResult: ({ result }) => {
			if (result.type !== 'redirect') disabled = false;
			if (result.type === 'error') {
				toast.error(`Failed to login: ${result.error.message}`);

				console.log(result.error);
			}
		}
	});

	const { form: data, enhance, errors } = form;
</script>

<form method="POST" action={route('default /auth/sign-in')} use:enhance class="flex flex-col gap-4">
	<Form.Field {form} name="identifier">
		<Form.Control>
			{#snippet children({ props })}
				<div class="flex h-6 items-center justify-between">
					<Form.Label class={cn($errors.identifier && 'text-red-400')}
						>Handle or Email Address</Form.Label
					>
					<Form.FieldErrors />
				</div>

				<Input
					{...props}
					{disabled}
					class={cn($errors.identifier && 'border-red-400')}
					type="text"
					autocomplete="username"
					placeholder="email@contoso.com / john.doe123"
					required
					bind:value={$data.identifier}
					bind:ref={firstFieldRef}
				/>
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<div class="flex items-center justify-between">
					<Form.Label class={cn($errors.password && 'text-red-400')}>Password</Form.Label>
					<Form.FieldErrors />
				</div>

				<Input
					{...props}
					{disabled}
					class={cn($errors.password && 'border-red-400')}
					type="password"
					autocomplete="current-password"
					placeholder="****************"
					required
					bind:value={$data.password}
				/>
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Button {disabled} class="bg-foreground text-background w-full">
		{#if disabled}
			<LoadingSpinner class="stroke-background" />
		{:else}
			Sign In
		{/if}
	</Form.Button>
</form>
