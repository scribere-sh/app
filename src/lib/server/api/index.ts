import type { Handle } from '@sveltejs/kit';

import { Elysia } from 'elysia';

const apiPrefix = '/api';
const apiHandler = new Elysia({
	/**
	 * Prefix so elysia's router works correctly
	 */
	prefix: apiPrefix,
	/**
	 * Disable ahead of time complication because it break cloudflare pages.
	 *
	 * This caused me untold pain for ages.
	 *
	 * Every Elysia instance must use this option.
	 *
	 * @see https://github.com/elysiajs/elysia/issues/58
	 * @see https://elysiajs.com/blog/elysia-06#dynamic-mode
	 */
	aot: false
}).get('/ping', ({ set }) => {
	set.status = 201;

	return;
});

export type Api = typeof apiHandler;

export const apiServerHandler: Handle = ({ event, resolve }) => {
	if (event.url.pathname.startsWith(apiPrefix)) {
		return apiHandler.handle(event.request);
	}

	return resolve(event);
};
