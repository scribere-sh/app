<script lang="ts">
	import '../app.css';

	import { Toaster } from '$ui/sonner';

	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';

	let { children } = $props();

	let disableTransitions = $state(true);

	onMount(() => {
		// FOUC / Transition minimisation
		disableTransitions = false;
	});
</script>

<ModeWatcher defaultTheme="default" {disableTransitions} />

<Toaster />

{@render children()}
