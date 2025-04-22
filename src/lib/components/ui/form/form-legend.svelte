<script lang="ts">
	import * as FormPrimitive from 'formsnap';
	import type { WithoutChild } from 'bits-ui';

	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		...rest
	}: WithoutChild<FormPrimitive.LegendProps> = $props();
</script>

<FormPrimitive.Legend
	bind:ref
	class={cn(
		'text-primary/50 data-[fs-error]:text-destructive text-xs leading-none font-semibold',
		className
	)}
	{...rest}
/>
