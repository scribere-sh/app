import type { DehydratedState } from "@tanstack/svelte-query";

import type { D1Database, ExecutionContext, Fetcher, KVNamespace, R2Bucket } from "@cloudflare/workers-types";

declare global {
    interface Window {
        setTheme: (theme: string) => void;
        resetTheme: () => void;
    }

    namespace App {
        interface Error {
            message?: string;
        }

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
                 * Link to D1 Database
                 */
                DB: D1Database;
                /**
                 * Doesn't work during vite dev, replace with normal fetch
                 */
                ARGON2: Fetcher;
            };
        }
    }
}

export {};
