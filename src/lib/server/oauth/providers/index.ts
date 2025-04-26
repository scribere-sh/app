import { t } from "elysia";

export const PROVIDER_NAMES = ["github"] as const;

export type ProviderName = (typeof PROVIDER_NAMES)[number];

export const ProviderNameSchema = t.UnionEnum(PROVIDER_NAMES);
