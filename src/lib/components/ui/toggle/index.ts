import Root from "./toggle.svelte";

import { tv, type VariantProps } from "tailwind-variants";

export const toggleVariants = tv({
    base:
        "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-input/25 data-[state=on]:text-primary [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    variants: {
        variant: {
            default: "bg-transparent",
            outline: "border border-input bg-transparent hover:bg-input/25 hover:primary",
        },
        size: {
            default: "h-10 min-w-10 px-3",
            sm: "h-9 min-w-9 px-2.5",
            lg: "h-11 min-w-11 px-5",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});

export type ToggleVariant = VariantProps<typeof toggleVariants>["variant"];
export type ToggleSize = VariantProps<typeof toggleVariants>["size"];
export type ToggleVariants = VariantProps<typeof toggleVariants>;

export {
    Root,
    //
    Root as Toggle,
};
