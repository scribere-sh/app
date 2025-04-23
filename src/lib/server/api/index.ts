import type { Handle } from '@sveltejs/kit';

import { dev } from '$app/environment';

import serverTiming from '@elysiajs/server-timing';

import { Elysia } from 'elysia';

const apiPrefix = '/api';
const apiHandler = new Elysia({ prefix: apiPrefix })
	.use(
		serverTiming({
			enabled: dev
		})
	)
	.get(
		'/ping',
		({ set }) => {
			set.status = 201;

			return;
		}
	);

export type Api = typeof apiHandler;

export const apiServerHandler: Handle = ({ event, resolve }) => {
	if (event.url.pathname.startsWith(apiPrefix)) {
		return apiHandler.handle(event.request);
	}

	return resolve(event);
};
