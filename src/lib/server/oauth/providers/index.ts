import { type } from "arktype";

export const PROVIDER_NAMES = ["github"] as const;

export type ProviderName = (typeof PROVIDER_NAMES)[number];

export const ProviderNameSchema = type.string.filter((val): val is ProviderName => {
    return PROVIDER_NAMES.includes(val as ProviderName);
});
