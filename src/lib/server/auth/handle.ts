import type { Handle } from "@sveltejs/kit";

import { decodeJWT } from "@oslojs/jwt";
import { type } from "arktype";

import { type JWTPayload, jwtPayloadType, signJWT, verifyJWT } from "./jwt";

import { setSecureToken, TOKEN_COOKIE_NAME } from "./cookie";

import { PROVIDER_NAMES, type ProviderName } from "$srv/oauth/providers";

import { db } from "$srv/db";
import { usersTable } from "$srv/db/schema/user";
import { eq } from "drizzle-orm";

import { renewSession, verifySession } from "./session";

import { route } from "$lib/routes";

// oauth hook runs beforehand, if it reaches here, its not an oauth check
const isAuthPath = (path: string) => path.startsWith("/auth");
const isAPIPath = (path: string) => path.startsWith("/api");

const FIVE_DAYS_IN_SECONDS = 5 * 24 * 60 * 60;

const SIX_DAYS_IN_SECONDS = 6 * 24 * 60 * 60;

export const tokenReaderHandle: Handle = async ({ event, resolve }) => {
    const { cookies, platform } = event;
    if (!platform) throw new Error("unable to access platform APIs");
    const tokenCookie = cookies.get(TOKEN_COOKIE_NAME);

    const now_s = Date.now() / 1000;

    // redirect to sign in
    if (!tokenCookie) {
        // allow to enter sign in without needing anything
        //
        // the oauth handle runs before this one, meaning
        // we don't need to check it here
        if (isAuthPath(event.url.pathname)) {
            console.log("event has no token but it is being allowed through to an auth page");

            return resolve(event);
        }

        // API methods should NOT redirect to the sign-in
        // screen and should simply return a 401
        if (isAPIPath(event.url.pathname)) {
            console.log("event has no token and is attempting an API request, returning 401");

            return new Response(null, {
                status: 401,
            });
        }

        console.log("event has no token, redirected to sign in");
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
        || payload.exp < now_s
        // token is not yet valid (idk it's a part of the RFC)
        || payload.nbf > now_s
        // token session is invalid
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
        if (isAuthPath(event.url.pathname)) {
            console.log("token is invalid but it is being allowed through to an auth page");

            return resolve(event);
        }

        // API methods should NOT redirect to the sign-in
        // screen and should simply return a 401
        if (isAPIPath(event.url.pathname)) {
            console.log("token is invalid or expired and is attempting an API request, returning 401");

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
            console.log("expired token contains \"met\" item which is a valid method, redirecting to oauth");

            return new Response(null, {
                status: 303,
                headers: {
                    location: `/oauth/${payload.met}`,
                },
            });
        }

        console.log("token is invalid, redirecting to sign in");
        // if it is not there or invalid, we can just redirect to
        // the sign in page.
        return new Response(null, {
            status: 303,
            headers: {
                location: route("/auth/sign-in"),
            },
        });
    }

    // This will rate limit users with a token
    const { success } = await platform.env.RATELIMIT.limit({ key: payload.sid });

    if (!success) {
        return new Response(
            JSON.stringify({
                message: "429 - Too many requests",
            }),
            {
                status: 429,
            },
        );
    }

    // load the session keys from the KV namespace
    const sessionData = await verifySession(payload.sid, payload.sub);

    if (!sessionData) {
        // delete invalid cookie
        event.cookies.delete(TOKEN_COOKIE_NAME, { path: "/" });

        // allow to enter sign in without needing anything
        //
        // the oauth handle runs before this one, meaning
        // we don't need to check it here
        if (isAuthPath(event.url.pathname)) {
            console.warn("session is invalid but it is being allowed through to an auth page");
            return resolve(event);
        }

        // API methods should NOT redirect to the sign-in
        // screen and should simply return a 401
        if (isAPIPath(event.url.pathname)) {
            console.warn("session is invalid and is attempting an API request, returning 401");
            return new Response(null, {
                status: 401,
            });
        }

        // redirect to sign-in
        return new Response(null, {
            status: 303,
            headers: {
                location: route("/auth/sign-in"),
            },
        });
    }

    // if the expiration date is within 5 days, we should refresh it
    // better safe than sorry.
    //
    // pretty much just renews the token every 24 hours, but allows for
    // long weekends.
    if (payload.exp - now_s < FIVE_DAYS_IN_SECONDS) {
        console.info("token is expiring within 5 days, automatically renewing");
        // we work in milliseconds, tokens work in seconds
        const newExpiryDate = now_s + SIX_DAYS_IN_SECONDS;

        const [queryResult] = await db.query
            .select({
                dis: usersTable.displayName,
                han: usersTable.handle,
            })
            .from(usersTable)
            .where(eq(usersTable.id, payload.sub));

        // token expiry is emminent
        const newPayload = {
            ...payload,
            ...queryResult,

            // new expiry
            exp: newExpiryDate,
            iat: now_s,
            // account for clock skew
            nbf: now_s - 60,
        } satisfies JWTPayload;

        const newToken = await signJWT(newPayload);

        // micro-optimisation
        //
        // run this in the background when a session is renewed
        // since we don't need to use any data from it.
        platform.context.waitUntil(
            renewSession(sessionData.encoded),
        );

        // set new token
        setSecureToken(TOKEN_COOKIE_NAME, newToken, new Date(newExpiryDate * 1000));
    }

    event.locals.session = sessionData;

    event.locals.user = {
        id: payload.sub,
        displayName: payload.dis,
        handle: payload.han,
    };

    event.locals.token = tokenCookie;

    console.info("token is valid, continuing");
    return resolve(event);
};
