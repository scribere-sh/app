import type { Handle } from '@sveltejs/kit';

import { sequence } from '@sveltejs/kit/hooks';

import { tokenReaderHandle } from '$srv/auth/handle';

import { oauthServerHandle } from '$srv/oauth';
import { apiServerHandler } from '$srv/api';

import { contentTypeHandle, initializeDehydratedState } from '$srv/api/helpers';

export const handle: Handle = sequence(
	// oauth changes tokens, therefore I don't want
	// to check to prevent some weird edge case.
	oauthServerHandle,

	// check user token before continuing
	tokenReaderHandle,
	// elysia main handle
	apiServerHandler,

	// some stuff necessary for tanstack query
	contentTypeHandle,
	initializeDehydratedState
);
