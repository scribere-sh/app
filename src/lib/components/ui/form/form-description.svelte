<script lang="ts">
	import * as FormPrimitive from 'formsnap';
	import type { WithoutChild } from 'bits-ui';

	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		...rest
	}: WithoutChild<FormPrimitive.DescriptionProps> = $props();
</script>

<FormPrimitive.Description
	bind:ref
	class={cn('text-muted-foreground text-sm', className)}
	{...rest}
/>
