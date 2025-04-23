import { defineConfig } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { kitRoutes } from 'vite-plugin-kit-routes';

import { svelteTesting } from '@testing-library/svelte/vite';

import { resolve } from 'path';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		kitRoutes({
			exportObjects: true,
			format: 'route(path)',
			generated_file_path: 'src/lib/routes.ts',
			post_update_run: 'prettier --write ./src/lib/routes.ts'
		})
	],
	resolve: {
		alias: {
			$ui: resolve('./src/lib/components/ui'),
			$blk: resolve('./src/lib/components/blocks'),

			$srv: resolve('./src/lib/server'),
			$tb: resolve('./src/lib/server/db/schema')
		}
	},
	test: {
		workspace: [
			{
				extends: './vite.config.ts',
				plugins: [svelteTesting()],
				test: {
					name: 'client',
					environment: 'jsdom',
					clearMocks: true,
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
