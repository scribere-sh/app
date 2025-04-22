import Content from './hover-card-content.svelte';
import { LinkPreview as HoverCardPrimitive } from 'bits-ui';

const Root = HoverCardPrimitive.Root;
const Trigger = HoverCardPrimitive.Trigger;

export {
	Root,
	Content,
	Trigger,
	//
	Root as HoverCard,
	Content as HoverCardContent,
	Trigger as HoverCardTrigger
};
