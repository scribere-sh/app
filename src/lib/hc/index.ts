import { env } from "$env/dynamic/public";
import type { Api } from "$srv/api";

import { hc } from "hono/client";

export * from "./query";

export const api = hc<Api>(env.PUBLIC_ORIGIN ?? "https://app.scribere.sh").api;
