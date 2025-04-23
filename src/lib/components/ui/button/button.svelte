<script lang="ts">
	import { cn } from '$lib/utils';

	import { buttonVariants, type ButtonProps } from '.';

	let {
		class: className = '',
		variant = 'default',
		size = 'default',
		rounded = 'default',
		ref = $bindable(null),
		href = undefined,
		type = 'button',
		//
		children,
		...rest
	}: ButtonProps = $props();
</script>

{#if href}
	<a bind:this={ref} class={cn(buttonVariants({ variant, size, rounded }), className)} {href} {...rest}>
		{@render children?.()}
	</a>
{:else}
	<button bind:this={ref} class={cn(buttonVariants({ variant, size, rounded }), className)} {type} {...rest}>
		{@render children?.()}
	</button>
{/if}
