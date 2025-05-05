import type { R2Bucket } from "@cloudflare/workers-types";

export type R2UploadInput = Parameters<R2Bucket["put"]>[1];
