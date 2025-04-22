<script lang="ts">
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...rest
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} class={cn('flex flex-col space-y-1.5 p-6 pb-0', className)} {...rest}>
	{@render children?.()}
</div>
