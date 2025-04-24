import { dev } from '$app/environment';
import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';

import z from 'zod';

const createArgon2ResponseSchema = z.object({
	hash: z.string()
});

/**
 * Create an `argon2id` hash of the input data. Since cloudflare
 * is really REALLY limited at the free tier (and kinda slow).
 * This function calls a separate and bound worker (or a remote
 * worker) in dev.
 *
 * This has shown to have no issue consistently producing hashes
 * while getting around Yoobee security bs.
 *
 * > **This function can only be called by a SvelteKit handler due
 * > to the use of {@link getRequestEvent | `getRequestEvent()`}**
 *
 * @param to_hash the data to hash as a string
 * @returns an `argon2id` hash of the provided string
 */
export const createArgon2 = async (to_hash: string): Promise<string> => {
	const {
		platform,
		fetch,
		request: { signal }
	} = getRequestEvent();

	const body = JSON.stringify({
		password: to_hash,
		options: {
			timeCost: 2,
			memoryCost: 19456,
			parallelism: 1
		}
	});

	let response;

	if (dev) {
		// in development we use fetch to a remote worker, because any mention 
		// of the use of a hasher causes cloudflare to spontaneously combust.
		const { ARGON2_WORKER_DOMAIN } = env;

		if (!ARGON2_WORKER_DOMAIN) {
			throw new Error('Unable to contact argon2 worker');
		}

		response = await fetch(`https://${ARGON2_WORKER_DOMAIN}/hash`, {
			method: 'POST',
			body,
			signal
		});
	} else {
		if (!platform) {
			throw new Error('Unable to access platform API');
		}

		response = await platform.env.ARGON2.fetch('http://internal/hash', {
			method: 'POST',
			body,
			// @ts-expect-error weird cloudflare stuff
			signal
		});
	}

	const text = await response.text();

	try {
		const object = JSON.parse(text);

		const objectValidationResult = createArgon2ResponseSchema.safeParse(object);

		if (objectValidationResult.success) {
			return objectValidationResult.data.hash;
		} else {
			console.error(objectValidationResult.error);
			throw objectValidationResult.error;
		}
	} catch (e) {
		console.error(e);
		throw e;
	}
};

const verifyArgon2ResponseSchema = z.object({
	matches: z.boolean()
});

export const verifyArgon2 = async (hash: string, subject: string): Promise<boolean> => {
	const {
		fetch,
		platform,
		request: { signal }
	} = getRequestEvent();

	const body = JSON.stringify({
		password: subject,
		hash
	});

	let response;

	if (dev) {
		// in development we use fetch to a remote worker, because I said so.
		const { ARGON2_WORKER_DOMAIN } = env;

		if (!ARGON2_WORKER_DOMAIN) {
			throw new Error('Unable to contact argon2 worker');
		}

		response = await fetch(`https://${ARGON2_WORKER_DOMAIN}/verify`, {
			method: 'POST',
			body,
			signal
		});
	} else {
		if (!platform) {
			throw new Error('Unable to access platform API');
		}

		response = await platform.env.ARGON2.fetch('http://internal/verify', {
			method: 'POST',
			body,
			// @ts-expect-error weird cloudflare stuff
			signal
		});
	}

	const text = await response.text();

	try {
		const object = JSON.parse(text);

		const objectValidationResult = verifyArgon2ResponseSchema.safeParse(object);

		if (objectValidationResult.success) {
			return objectValidationResult.data.matches;
		} else {
			console.error(objectValidationResult.error);
			throw objectValidationResult.error;
		}
	} catch (e) {
		console.error(e);
		throw e;
	}
};
