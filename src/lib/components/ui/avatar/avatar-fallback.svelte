<script lang="ts">
	import { Avatar as AvatarPrimitive } from 'bits-ui';

	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		...rest
	}: AvatarPrimitive.FallbackProps = $props();
</script>

<AvatarPrimitive.Fallback
	bind:ref
	class={cn('bg-muted flex size-full items-center justify-center select-none', className)}
	{...rest}
/>
