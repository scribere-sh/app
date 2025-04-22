<script lang="ts">
	import '../app.css';

	import { Toaster } from '$ui/sonner';

	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher />

<Toaster />

{@render children()}
