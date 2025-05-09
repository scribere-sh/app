import { dev } from "$app/environment";
import { getRequestEvent } from "$app/server";
import { env } from "$env/dynamic/private";
import { type } from "arktype";

const createArgon2ResponseType = type({
    hash: "string",
});

/**
 * # createArgon2
 *
 * Create an `argon2id` hash of the input data. Since cloudflare
 * is really REALLY limited at the free tier (and kinda slow).
 * This function calls a separate and bound worker (or a remote
 * worker) in dev.
 *
 * This has shown to have no issue consistently producing hashes
 * while getting around Yoobee security bs.
 *
 * **This function can only be called by a SvelteKit handler due
 * to the use of {@link getRequestEvent | `getRequestEvent()`}.**
 *
 * @param to_hash - the data to hash as a string
 * @returns an `argon2id` hash of the {@link to_hash | provided string}
 */
export const createArgon2 = async (to_hash: string): Promise<string> => {
    const {
        platform,
        fetch,
        request: { signal },
    } = getRequestEvent();

    const body = JSON.stringify({
        password: to_hash,
        options: {
            timeCost: 2,
            memoryCost: 19456,
            parallelism: 1,
        },
    });

    let response;

    if (dev || !!env.ARGON2_WORKER_DOMAIN) {
        // in development we use fetch to a remote worker, because any mention
        // of the use of a hasher causes cloudflare to spontaneously combust.
        const { ARGON2_WORKER_DOMAIN } = env;

        if (!ARGON2_WORKER_DOMAIN) {
            throw new Error("Unable to contact argon2 worker");
        }

        response = await fetch(`https://${ARGON2_WORKER_DOMAIN}/hash`, {
            method: "POST",
            body,
            headers: {
                "Authorization": env.ARGON2_AUTHORIZATION_HEADER,
            },
            signal,
        });
    } else {
        if (!platform) {
            throw new Error("Unable to access platform API");
        }

        response = await platform.env.ARGON2.fetch("http://internal/hash", {
            method: "POST",
            body,
            // @ts-expect-error weird cloudflare stuff
            signal,
        });
    }

    const text = await response.text();

    try {
        const object = JSON.parse(text);

        const objectValidationResult = createArgon2ResponseType(object);

        if (objectValidationResult instanceof type.errors) {
            console.error(objectValidationResult);
            throw new Error(objectValidationResult.summary);
        } else {
            return objectValidationResult.hash;
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
};

const verifyArgon2ResponseType = type({
    matches: "boolean",
});

/**
 * # verifyArgon2
 *
 * Takes a stored `argon2id` hash and a test subject and checks if
 * they match.
 *
 * Since cloudflare is really REALLY limited at the free tier (and kinda
 * slow). This function calls a separate and bound worker (or a remote
 * worker) in dev.
 *
 * **This function can only be called by a SvelteKit handler due
 * to the use of {@link getRequestEvent | `getRequestEvent()`}.**
 *
 * @param hash - the stored hash to compare against
 * @param subject - the data to be checked
 * @returns whether the {@link subject} matches the {@link hash}.
 */
export const verifyArgon2 = async (hash: string, subject: string): Promise<boolean> => {
    const {
        fetch,
        platform,
        request: { signal },
    } = getRequestEvent();

    const body = JSON.stringify({
        password: subject,
        hash,
    });

    let response;

    if (dev || !!env.ARGON2_WORKER_DOMAIN) {
        // in development we use fetch to a remote worker, because I said so.
        const { ARGON2_WORKER_DOMAIN } = env;

        if (!ARGON2_WORKER_DOMAIN) {
            throw new Error("Unable to contact argon2 worker");
        }

        response = await fetch(`https://${ARGON2_WORKER_DOMAIN}/verify`, {
            method: "POST",
            body,
            headers: {
                "Authorization": env.ARGON2_AUTHORIZATION_HEADER,
            },
            signal,
        });
    } else {
        if (!platform) {
            throw new Error("Unable to access platform API");
        }

        response = await platform.env.ARGON2.fetch("http://internal/verify", {
            method: "POST",
            body,
            // @ts-expect-error weird cloudflare stuff
            signal,
        });
    }

    const text = await response.text();

    try {
        const object = JSON.parse(text);

        const objectValidationResult = verifyArgon2ResponseType(object);

        if (objectValidationResult instanceof type.errors) {
            console.error(objectValidationResult);
            throw new Error(objectValidationResult.summary);
        } else {
            return objectValidationResult.matches;
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
};
