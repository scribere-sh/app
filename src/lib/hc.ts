import type { Api } from "$srv/api";

import { hc } from "hono/client";

export const api = hc<Api>("").api;
