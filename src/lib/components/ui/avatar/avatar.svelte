<script lang="ts">
	import { Avatar as AvatarPrimitive } from 'bits-ui';

	import { cn } from '$lib/utils';

	let { ref = $bindable(null), class: className, ...rest }: AvatarPrimitive.RootProps = $props();
</script>

<AvatarPrimitive.Root
	bind:ref
	class={cn('relative flex size-10 shrink-0 overflow-hidden rounded-full', className)}
	{...rest}
/>
