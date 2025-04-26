import type { DehydratedState } from "@tanstack/svelte-query";

import type { ExecutionContext, Fetcher, KVNamespace, R2Bucket } from "@cloudflare/workers-types";

declare global {
    namespace App {
        interface Locals {
            dehydrated: DehydratedState;

            /**
             * Keep in mind that within the auth system this will be undefined
             *
             * but i don't want to assert when we're not in the auth system (which
             * is most of the time).
             */
            user: {
                id: string;
                display_name: string;
                handle: string;
            };
        }

        interface Platform {
            context: ExecutionContext;

            env: {
                /**
                 * KV Namespace for loading signing keys
                 */
                KV: KVNamespace;
                /**
                 * Links to R2 File Bucket
                 */
                R2: R2Bucket;
                /**
                 * Doesn't work during vite dev, replace with normal fetch
                 */
                ARGON2: Fetcher;
            };
        }
    }
}

export {};
