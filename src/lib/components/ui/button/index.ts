import Root from './button.svelte';

import type { WithElementRef } from 'bits-ui';
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
import { tv, type VariantProps } from 'tailwind-variants';

export const buttonVariants = tv({
	base: 'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer',
	variants: {
		variant: {
			default: 'bg-primary text-primary-foreground hover:bg-primary/90',
			destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
			'destructive-ghost': 'hover:bg-destructive/90 hover:text-destructive-foreground',
			outline:
				'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
			secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
			ghost: 'hover:bg-accent hover:text-accent-foreground',
			link: 'text-primary underline-offset-4 hover:underline'
		},
		rounded: {
			default: 'rounded-md',
			pill: 'rounded-full'
		},
		size: {
			default: 'h-10 px-4 py-2',
			sm: 'h-9 rounded-md px-3',
			lg: 'h-11 rounded-md px-8',
			icon: 'h-10 w-10',
			dropdown: 'h-9 w-full justify-start px-3',
			'dropdown-inset': 'h-9 w-full justify-start pl-8 pr-3'
		}
	},
	defaultVariants: {
		variant: 'default',
		rounded: 'default',
		size: 'default'
	}
});

export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
export type ButtonSize = VariantProps<typeof buttonVariants>['size'];
export type ButtonRounded = VariantProps<typeof buttonVariants>['rounded'];

export type ButtonProps = WithElementRef<HTMLAnchorAttributes> &
	WithElementRef<HTMLButtonAttributes> & {
		size?: ButtonSize;
		variant?: ButtonVariant;
		rounded?: ButtonRounded;
	};

export {
	Root,
	//
	Root as Button
};

export default Root;
