import { getRequestEvent } from "$app/server";

import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";

import { uint8ArrayStrictEqual } from "./key";
import { generateTokenString } from "./token";

import { db } from "$srv/db";
import { sessionDetailsTable } from "$tb/session";
import { eq } from "drizzle-orm";

const SIX_DAYS_IN_SECONDS = 6 * 24 * 60 * 60;

/**
 * generate a session with details derived from the platform api
 * and add it to the sessions kv namespace.
 *
 * store details in the database
 *
 * return session token to put in a token
 *
 * **This function can only be called by a SvelteKit handler due
 * to the use of {@link getRequestEvent | `getRequestEvent()`}.**
 *
 * @param userId - the user this session relates to
 */
export const generateSession = async (userId: string): Promise<string> => {
    const { platform, getClientAddress, request } = getRequestEvent();
    if (!platform) throw new Error("unable to access platform APIs");

    const sessionToken = generateTokenString(32);
    const sessionId = sha256(new TextEncoder().encode(sessionToken));
    const sessionIdEncoded = encodeHexLowerCase(sessionId);

    const userIdHash = sha256(new TextEncoder().encode(userId));

    await Promise.all([
        platform.env.SESSIONS.put(sessionIdEncoded, userIdHash, {
            expirationTtl: SIX_DAYS_IN_SECONDS,
        }),
        db.query
            .insert(sessionDetailsTable)
            .values({
                sessionId: sessionId,
                userIdHash: userIdHash,
                createdAt: new Date(),

                ip: getClientAddress(),
                userAgent: request.headers.get("user-agent"),
            }),
    ]);

    return sessionToken;
};

export const verifySession = async (
    sessionToken: string,
    userId: string,
): Promise<{ raw: Uint8Array; encoded: string } | null> => {
    const { platform } = getRequestEvent();
    if (!platform) throw new Error("unable to access platform APIs");

    const sessionId = sha256(new TextEncoder().encode(sessionToken));
    const sessionIdEncoded = encodeHexLowerCase(sessionId);

    const userIdHash = sha256(new TextEncoder().encode(userId));

    const userIdStored = await platform.env.SESSIONS.get(sessionIdEncoded, { type: "arrayBuffer" });
    if (!userIdStored) return null;

    const userIdsMatch = uint8ArrayStrictEqual(new Uint8Array(userIdStored), userIdHash);
    if (!userIdsMatch) return null;

    return {
        raw: sessionId,
        encoded: sessionIdEncoded,
    };
};

export const renewSession = async (sessionIdEncoded: string) => {
    const { platform } = getRequestEvent();
    if (!platform) throw new Error("unable to access platform APIs");

    const userIdHash = await platform.env.SESSIONS.get(sessionIdEncoded, { type: "arrayBuffer" });

    if (userIdHash) {
        await platform.env.SESSIONS.put(sessionIdEncoded, userIdHash, {
            expirationTtl: SIX_DAYS_IN_SECONDS,
        });
    }
};

export const getSessionDetail = async (sessionId: Uint8Array) => {
    return await db.query
        .select({
            ip: sessionDetailsTable.ip,
            userAgent: sessionDetailsTable.userAgent,
            createdAt: sessionDetailsTable.createdAt,
        })
        .from(sessionDetailsTable)
        .where(eq(
            sessionDetailsTable.sessionId,
            sessionId,
        ));
};

export const getSessionDetailsForUser = async (userId: string) => {
    const userIdHash = sha256(new TextEncoder().encode(userId));

    return await db.query
        .select({
            ip: sessionDetailsTable.ip,
            userAgent: sessionDetailsTable.userAgent,
            createdAt: sessionDetailsTable.createdAt,
        })
        .from(sessionDetailsTable)
        .where(eq(
            sessionDetailsTable.userIdHash,
            userIdHash,
        ));
};

export const deleteSession = async (sessionId: Uint8Array) => {
    const { platform } = getRequestEvent();
    if (!platform) throw new Error("unable to access platform APIs");

    const sessionIdEncoded = encodeHexLowerCase(sessionId);

    await Promise.all([
        platform.env.SESSIONS.delete(sessionIdEncoded),
        db.query
            .delete(sessionDetailsTable)
            .where(eq(
                sessionDetailsTable.sessionId,
                sessionId,
            )),
    ]);
};
