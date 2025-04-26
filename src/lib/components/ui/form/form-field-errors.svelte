<script lang="ts">
	import * as FormPrimitive from 'formsnap';
	import type { WithoutChild } from 'bits-ui';
	import { fly } from 'svelte/transition';

	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		errorClasses,
		children: childrenProp,
		...rest
	}: WithoutChild<FormPrimitive.FieldErrorsProps> & {
		errorClasses?: string | undefined | null;
	} = $props();
</script>

<FormPrimitive.FieldErrors bind:ref class={cn('text-xs font-medium', className)} {...rest}>
	{#snippet children({ errors, errorProps })}
		{#if childrenProp}
			{@render childrenProp({ errors, errorProps })}
		{:else}
			{#each errors as error (error)}
				<div {...errorProps} in:fly={{ x: 10 }} class={cn('text-red-400', errorClasses)}>
					{error}
				</div>
			{/each}
		{/if}
	{/snippet}
</FormPrimitive.FieldErrors>
