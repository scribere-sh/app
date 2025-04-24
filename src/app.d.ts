import type { DehydratedState } from '@tanstack/svelte-query';

import type { Fetcher, R2Bucket } from '@cloudflare/workers-types';

declare global {
	namespace App {
		interface Locals {
			dehydrated: DehydratedState;
		}

		interface Platform {
			env: {
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
