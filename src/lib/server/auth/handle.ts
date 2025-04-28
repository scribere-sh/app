import type { Handle } from "@sveltejs/kit";

import { decodeJWT } from "@oslojs/jwt";
import { type } from "arktype";

import { type JWTPayload, jwtPayloadType, signJWT, verifyJWT } from "./jwt";

import { TOKEN_COOKIE_NAME } from "./cookie";

import { PROVIDER_NAMES, type ProviderName } from "$srv/oauth/providers";

import { route } from "$lib/routes";

// oauth hook runs beforehand, if it reaches here, its not an oauth check
const isAuthPath = (path: string) => path.startsWith("/auth");
const isAPIPath = (path: string) => path.startsWith("/api");

const FOUR_DAYS_IN_SECONDS = 4 * 24 * 60 * 60;

const SIX_DAYS_IN_SECONDS = 6 * 24 * 60 * 60;

export const tokenReaderHandle: Handle = async ({ event, resolve }) => {
    const { cookies } = event;
    const tokenCookie = cookies.get(TOKEN_COOKIE_NAME);

    const now_s = Date.now() / 1000;

    // redirect to sign in
    if (!tokenCookie) {
        // allow to enter sign in without needing anything
        //
        // the oauth handle runs before this one, meaning
        // we don't need to check it here
        if (isAuthPath(event.url.pathname)) {
            console.warn("event has no token but it is being allowed through to an auth page");
            return resolve(event);
        }

        // API methods should NOT redirect to the sign-in
        // screen and should simply return a 401
        if (isAPIPath(event.url.pathname)) {
            console.warn("event has no token and is attempting an API request, returning 401");
            return new Response(null, {
                status: 401,
            });
        }

        console.info("event has no token, redirected to sign in");
        return new Response(null, {
            status: 303,
            headers: {
                location: route("/auth/sign-in"),
            },
        });
    }

    // check if token is valid, if not redirect user to sign-in
    const payload = jwtPayloadType(await verifyJWT(tokenCookie));

    // token signature verification failed or the data is invalid
    if (
        // failed to parse token body
        payload instanceof type.errors
        // token is expired
        || payload.exp > now_s
        // token is not yet valid (idk it's a part of the RFC)
        || payload.nbf < now_s
    ) {
        // the token may contain an indication of the login method
        //
        // even if we don't know the tokens validity, it's worth
        // checking because it could be a nice convenience feature.
        const payload = decodeJWT(tokenCookie);

        event.cookies.delete(TOKEN_COOKIE_NAME, { path: "/" });

        // allow to enter sign in without needing anything
        //
        // the oauth handle runs before this one, meaning
        // we don't need to check it here
        console.warn("token is invalid but it is being allowed through to an auth page");
        if (isAuthPath(event.url.pathname)) {
            return resolve(event);
        }

        // API methods should NOT redirect to the sign-in
        // screen and should simply return a 401
        console.warn("token is invalid or expired and is attempting an API request, returning 401");
        if (isAPIPath(event.url.pathname)) {
            return new Response(null, {
                status: 401,
            });
        }

        // if the method is a valid oauth method, we can redirect
        // them directly saving some time
        if (
            "met" in payload
            && typeof payload.met === "string"
            && PROVIDER_NAMES.includes(payload.met as ProviderName)
        ) {
            console.info("expired token contains \"met\" item which is a valid method, redirecting to oauth");
            return new Response(null, {
                status: 303,
                headers: {
                    location: `/oauth/${payload.met}`,
                },
            });
        }

        console.warn("token is invalid, redirecting to sign in");
        // if it is not there or invalid, we can just redirect to
        // the sign in page.
        return new Response(null, {
            status: 303,
            headers: {
                location: route("/auth/sign-in"),
            },
        });
    }

    // if the expiration date is within 4 days, we should refresh it
    if (payload.exp - now_s < FOUR_DAYS_IN_SECONDS) {
        console.info("token is expiring within 4 days, automatically renewing");
        // we work in milliseconds, tokens work in seconds
        const newExpiryDate = now_s + SIX_DAYS_IN_SECONDS;

        // token expiry is emminent
        const newPayload = {
            ...payload,

            // new expiry
            exp: newExpiryDate,
            iat: now_s,
            // account for clock skew
            nbf: now_s - 60,
        } satisfies JWTPayload;

        const newToken = await signJWT(newPayload);

        // set new token
        event.cookies.set(TOKEN_COOKIE_NAME, newToken, {
            path: "/",
            httpOnly: true,
            secure: import.meta.env.PROD,
            expires: new Date(newExpiryDate),
            sameSite: "lax",
        });
    }

    event.locals.user = {
        id: payload.sub,
        display_name: payload.dis,
        handle: payload.han,
    };

    console.info("token is valid, continuing");
    return resolve(event);
};
