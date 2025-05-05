import type {
    Cache,
    CacheStorage,
    CfProperties,
    D1Database,
    ExecutionContext,
    Fetcher,
    ImagesBinding,
    KVNamespace,
    R2Bucket,
} from "@cloudflare/workers-types";

import type { User } from "$lib/schema/user";

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
            /**
             * Keep in mind that within the auth system this will be undefined
             *
             * but i don't want to assert when we're not in the auth system (which
             * is most of the time).
             */
            user: User;

            /**
             * Details on the session
             */
            session: {
                raw: Uint8Array;
                encoded: string;
            };

            /**
             * The token itself to be used for updating down the line
             */
            token: string;
        }

        interface Platform {
            caches: CacheStorage & { default: Cache };

            context: ExecutionContext;

            cf: CfProperties;

            env: {
                /**
                 * KV Namespace for loading signing keys
                 */
                KV: KVNamespace;
                /**
                 * KV Namespace for session validation
                 */
                SESSIONS: KVNamespace;
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
                /**
                 * Transform some images
                 */
                IMAGES: ImagesBinding;
            };
        }
    }
}

export {};
