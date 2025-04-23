import type { Handle } from '@sveltejs/kit';

import { dev } from '$app/environment';

import { Elysia } from 'elysia';

import { cors } from '@elysiajs/cors'
import { serverTiming } from '@elysiajs/server-timing';

const apiPrefix = '/api';
const apiHandler = new Elysia({
	/**
	 * Prefix so elysia's router works correctly
	 */
	prefix: apiPrefix,
	/**
	 * Disable ahead of time complication because it break cloudflare pages.
	 * 
	 * We can use it in dev tho
	 *
	 * This caused me untold pain for ages.
	 *
	 * Every Elysia instance must use this option.
	 *
	 * @see https://github.com/elysiajs/elysia/issues/58
	 * @see https://elysiajs.com/blog/elysia-06#dynamic-mode
	 */
	aot: dev
})
	.use(serverTiming())
	.use(cors({
		methods: ["GET", "POST", "PUT", "DELETE"],
		origin: true
	}))
	.onError(({ error }) => {
		console.error(error);
	})
	/**
	 * A basic ping handler to test stuff
	 */
	.get('/ping', ({ set }) => {
		set.status = 'OK';
	});

export type Api = typeof apiHandler;

export const apiServerHandler: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith(apiPrefix)) {
		return apiHandler.handle(event.request);
	}

	return resolve(event);
};
