// used in tsdoc
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { KVNamespace } from "@cloudflare/workers-types";

import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";

import { sha256 } from "@oslojs/crypto/sha2";

import { getRequestEvent } from "$app/server";

/**
 * # getCurrentSigningKID
 *
 * Get the currently used signing key from the KV Namespace
 *
 * **This function can only be called by a SvelteKit handler due
 * to the use of {@link getRequestEvent | `getRequestEvent()`}.**
 *
 * @returns the value of `current` within the {@link KVNamespace}
 */
export const getCurrentSigningKID = async () => {
    if (dev) {
        return env.LOCAL_SIGNING_KEY_KID;
    }

    const { platform } = getRequestEvent();
    if (!platform) throw new Error("Unable to access Platform APIs");

    const KV = platform.env.KV;

    // as of 26 Apr 2025 @ 00:00:00 UTC this will be a safe operation
    return (await KV.get("current"))!;
};

/**
 * # getSigningKey
 *
 * Lookup a signing key within the KV Namespace
 *
 * **This function can only be called by a SvelteKit handler due
 * to the use of {@link getRequestEvent | `getRequestEvent()`}.**
 *
 * @param kid - the KID to be fetched
 * @returns the key arraybuffer from the {@link KVNamespace}
 */
export const getSigningKey = async (kid: string) => {
    if (dev) {
        // allows us to simulate bad tokens
        if (kid === env.LOCAL_SIGNING_KEY_KID) {
            return sha256(new TextEncoder().encode(env.LOCAL_SIGNING_KEY));
        }

        return null;
    }

    const { platform } = getRequestEvent();
    if (!platform) throw new Error("Unable to access Platform APIs");

    const KV = platform.env.KV;

    const key = await KV.get(kid, "arrayBuffer");

    if (key) return new Uint8Array(key);
    return key;
};

/**
 * # uint8ArrayStrictEqual
 *
 * compare 2 {@link Uint8Array}'s and their contents,
 * because this functionality isn't buit in for some
 * reason.
 *
 * @param lhs - a {@link Uint8Array} to compare
 * @param rhs - a {@link Uint8Array} to compare
 * @returns if the 2 supplied {@link Uint8Array}'s are equal
 */
export const uint8ArrayStrictEqual = (lhs: Uint8Array, rhs: Uint8Array) => {
    if (lhs.byteLength !== rhs.byteLength) return false;

    for (let i = 0; i < lhs.byteLength; i++) {
        if (lhs[i] !== rhs[i]) return false;
    }

    return true;
};
