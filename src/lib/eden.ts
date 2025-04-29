import type { Api } from "$srv/api";

import {
    createEdenTreatySvelteQuery,
    type InferTreatyQueryInput,
    type InferTreatyQueryOutput,
} from "@ap0nia/eden-svelte-query";

/**
 * For convenience sake I've chopped off the .api bit otherwise it would be EVERYWHERE lmao.
 */
export const eden = createEdenTreatySvelteQuery<Api>();

export type InferInput = InferTreatyQueryInput<Api>;
export type InferOutput = InferTreatyQueryOutput<Api>;
