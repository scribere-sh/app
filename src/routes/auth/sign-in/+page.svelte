<script lang="ts">
	import type { PageProps } from './$types';

	import * as Card from '$ui/card';
	import { Button } from '$ui/button';

	import LoginForm from './form.svelte';
	import { route } from '$lib/routes';

	const { data }: PageProps = $props();
	const { form, csrf } = data;
</script>

<!-- even out the spacing -->
<div class="h-24"></div>

<Card.Root class="flex flex-row items-center gap-2 backdrop-brightness-95">
	<div class="w-96">
		<Card.Header>
			<Card.Title>Sign In</Card.Title>
			<Card.Description
				>Or use the providers to the right if you linked them.</Card.Description
			>
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

	<div class="flex w-96 flex-col items-center justify-center">oauth stuff</div>
</Card.Root>

<div class="mt-8 flex h-24 w-32 flex-col items-center justify-center gap-4">
	<Button href={route('/auth/register')} variant="link" class="text-foreground w-full">
		Register
	</Button>

	<Button href={route('/')} variant="link" class="text-foreground w-full">
		Forgot Password?
	</Button>
</div>
