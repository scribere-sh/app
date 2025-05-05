import { getRequestEvent } from "$app/server";
import { generateTokenString } from "./auth/token";

const CSRF_TOKEN_NAME = "csrf";

/**
 * initialises a CSRF session, set the cookie and return the token for
 * rendering into the form.
 *
 * **This function can only be called by a SvelteKit handler due
 * to the use of {@link getRequestEvent | `getRequestEvent()`}.**
 *
 * generates a session-valid token that can be used for CSRF protection
 */
export const initCsrf = (): string => {
    const { cookies } = getRequestEvent();

    const currentCookie = cookies.get(CSRF_TOKEN_NAME);
    if (currentCookie) return currentCookie;

    const csrfToken = generateTokenString(32);

    cookies.set(CSRF_TOKEN_NAME, csrfToken, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: import.meta.env.PROD,
    });

    return csrfToken;
};

/**
 * validates a CSRF Token against a supplied one (assumed to be placed
 * within a form).
 *
 * **This function can only be called by a SvelteKit handler due
 * to the use of {@link getRequestEvent | `getRequestEvent()`}.**
 */
export const validateCsrf = (formToken: string): boolean => {
    const { cookies } = getRequestEvent();

    const csrfTokenCookieValue = cookies.get(CSRF_TOKEN_NAME);

    return csrfTokenCookieValue === formToken;
};

/**
 * Clean up the CSRF cookie.
 *
 * Run this if you're about to redirect the user elsewhere and
 * a CSRF token is no longer needed. If the form used results
 * in a success, don't bother cleaning this up.
 *
 * **This function can only be called by a SvelteKit handler due
 * to the use of {@link getRequestEvent | `getRequestEvent()`}.**
 */
export const cleanupCsrf = () => {
    const { cookies } = getRequestEvent();

    cookies.delete(CSRF_TOKEN_NAME, { path: "/" });
};
