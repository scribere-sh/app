import Description from "./alert-description.svelte";
import Title from "./alert-title.svelte";
import Root from "./alert.svelte";

import { tv, type VariantProps } from "tailwind-variants";

export const alertVariants = tv({
    base:
        "relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
    variants: {
        variant: {
            default: "bg-background text-foreground",
            destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export type AlertVariant = VariantProps<typeof alertVariants>["variant"];

export {
    Description,
    Description as AlertDescription,
    Root,
    //
    Root as Alert,
    Title,
    Title as AlertTitle,
};
