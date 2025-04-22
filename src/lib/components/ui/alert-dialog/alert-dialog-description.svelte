<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';

	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		...rest
	}: AlertDialogPrimitive.DescriptionProps = $props();
</script>

<AlertDialogPrimitive.Description
	bind:ref
	class={cn('text-muted-foreground text-sm', className)}
	{...rest}
/>
