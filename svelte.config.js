import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import { resolve } from 'path';

/** @type { import('@sveltejs/kit').Config } */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$ui: resolve('./src/lib/components/ui'),
			$srv: resolve('./src/lib/server'),
			$tb: resolve('./src/lib/server/db/schema')
		},
		version: {
			pollInterval: 10_000
		}
	}
};

export default config;
