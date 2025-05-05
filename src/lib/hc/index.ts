import type { Api } from "$srv/api";
import { hc } from "hono/client";

export * from "./query";

export const api = hc<Api>("http://localhost:5173").api;
