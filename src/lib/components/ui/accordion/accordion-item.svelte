<script lang="ts">
	import { Accordion as AccordionPrimitive } from 'bits-ui';

	import { cn } from '$lib/utils';

	let { ref = $bindable(null), class: className, ...rest }: AccordionPrimitive.ItemProps = $props();
</script>

<AccordionPrimitive.Item bind:ref class={cn('not-last:border-b', className)} {...rest} />
