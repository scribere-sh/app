import type { Handle } from "@sveltejs/kit";

import { sequence } from "@sveltejs/kit/hooks";

import { tokenReaderHandle } from "$srv/auth/handle";

import { apiServerHandler } from "$srv/api";

export const handle: Handle = sequence(
    // check user token before continuing
    tokenReaderHandle,
    // hono main handle
    apiServerHandler,
);
