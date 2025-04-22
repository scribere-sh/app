<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';

	import { buttonVariants, type ButtonVariant, type ButtonSize } from '$ui/button';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		variant,
		size,
		...rest
	}: AlertDialogPrimitive.ActionProps & {
		variant?: ButtonVariant;
		size?: ButtonSize;
	} = $props();
</script>

<AlertDialogPrimitive.Action
	bind:ref
	type="button"
	class={cn(buttonVariants({ variant, size }), className)}
	{...rest}
/>
