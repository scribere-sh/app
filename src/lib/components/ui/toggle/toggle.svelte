<script lang="ts">
	import { Toggle as TogglePrimitive } from 'bits-ui';

	import { cn } from '$lib/utils';

	import { toggleVariants, type ToggleVariant, type ToggleSize } from '.';

	let {
		ref = $bindable(null),
		pressed = $bindable(false),
		class: className,
		size = 'default',
		variant = 'default',
		...rest
	}: TogglePrimitive.RootProps & {
		variant?: ToggleVariant;
		size?: ToggleSize;
	} = $props();
</script>

<TogglePrimitive.Root
	bind:ref
	bind:pressed
	class={cn(toggleVariants({ variant, size }), className)}
	{...rest}
/>
