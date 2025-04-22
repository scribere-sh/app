import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';

import { Elysia, t } from 'elysia';
import { serverTiming } from '@elysiajs/server-timing';
import { cors } from '@elysiajs/cors';

import { ProviderNameSchema } from './providers';

const oauthPrefix = '/oauth';
const oauthHandler = new Elysia({ prefix: oauthPrefix })
	.use(
		serverTiming({
			enabled: dev
		})
	)
	.use(
		cors({
			credentials: false,
			methods: ['GET'],
			origin: true
		})
	)
	.guard(
		{
			params: t.Object({
				provider: ProviderNameSchema
			})
		},
		(app) =>
			app
				// #region Authorize
				.get('/:provider', ({ params: { provider } }) => {
					console.log({ provider });
				})
				// #endregion
				// #region Callback
				.get('/:provider/callback', ({ params: { provider } }) => {
					console.log({ provider });
				})
		// #endregion
	);

export const oauthServerHandle: Handle = ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/oauth')) {
		return oauthHandler.handle(event.request);
	}

	return resolve(event);
};
