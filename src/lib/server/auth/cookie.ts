import { getRequestEvent } from '$app/server';

export const TOKEN_COOKIE_NAME = 'token';

/**
 * Set a cookie in the event, this cookie is a secure httpOnly cookie, useful for tokens
 *
 * **This function can only be called by a SvelteKit handler due
 * to the use of {@link getRequestEvent | `getRequestEvent()`}.**
 *
 * @param name - cookie name
 * @param value - cookie valud
 * @param expires - expiry date
 */
export const setSecureToken = (name: string, value: string, expires: Date) => {
	const { cookies } = getRequestEvent();

	cookies.set(name, value, {
		path: '/',
		secure: import.meta.env.PROD,
		expires,
		httpOnly: true,
		sameSite: 'lax'
	});
};
