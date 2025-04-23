import type { Handle } from '@sveltejs/kit';

import { sequence } from '@sveltejs/kit/hooks';

import { oauthServerHandle } from '$srv/oauth';
import { apiServerHandler } from '$srv/api';
import { contentTypeHandle, initializeDehydratedState } from '$srv/api/helpers';

export const handle: Handle = sequence(
	apiServerHandler,
	oauthServerHandle,

	contentTypeHandle,
	initializeDehydratedState
);
