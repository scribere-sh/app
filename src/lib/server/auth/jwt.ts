import { PROVIDER_NAMES, type ProviderName } from "$srv/oauth/providers";

import { getCurrentSigningKID, getSigningKey, uint8ArrayStrictEqual } from "./key";

import { parseJWT } from "@oslojs/jwt";

import { hmac } from "@oslojs/crypto/hmac";
import { SHA256 } from "@oslojs/crypto/sha2";

import { type } from "arktype";

/**
 * # jwtPayloadType
 */
export const jwtPayloadType = type({
    /**
     * **`sub`**ject - user id
     */
    sub: "string",
    /**
     * user's name to display
     */
    dis: "string",
    /**
     * user's handle
     */
    han: "string",

    /**
     * issuer, i.e. us
     */
    iss: "'app.scribere.sh'",

    /**
     * session token hash this for the session ID
     */
    sid: "string",

    /**
     * issued at time
     *
     * stored as seconds since UNIX epoch
     */
    iat: "number",
    /**
     * expiry timestamp
     */
    exp: "number",
    /**
     * not valid before
     */
    nbf: "number",
    /**
     * users' sign in method this only handles oauth since
     * the password method is fallback anyway.
     */
    met: type.string
        .filter((s): s is ProviderName => PROVIDER_NAMES.includes(s as ProviderName))
        .optional(),
});

export type JWTPayload = typeof jwtPayloadType.infer;

/**
 * # signJWT
 *
 * Sign a token payload
 *
 * **This function can only be called by a SvelteKit handler due
 * to the use of {@link getRequestEvent | `getRequestEvent()`}.**
 *
 * @param payload - the payload to sign
 * @returns
 */
export const signJWT = async (payload: JWTPayload): Promise<string> => {
    const signingKid = await getCurrentSigningKID();
    const signingKey = await getSigningKey(signingKid);

    if (!signingKey) throw new Error("unable to get signing key");

    const encodedHeader = Buffer.from(
        JSON.stringify(
            {
                alg: "HS256",
                typ: "JWT",
                kid: signingKid,
            } satisfies JWTHeader,
        ),
    ).toString("base64url");

    const endodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");

    const signingPayload = encodedHeader + "." + endodedPayload;

    const signature = hmac(SHA256, signingKey, new TextEncoder().encode(signingPayload));

    const encodedSignature = Buffer.from(signature).toString("base64url");

    return signingPayload + "." + encodedSignature;
};

const jwtHeaderSchema = type({
    alg: "'HS256'",
    typ: "'JWT'",
    kid: "string",
});

type JWTHeader = typeof jwtHeaderSchema.infer;

/**
 * # verifyJWT
 *
 * Verify a JWT
 *
 * **This function can only be called by a SvelteKit handler due
 * to the use of {@link getRequestEvent | `getRequestEvent()`}.**
 *
 * @param jwt - the JWT from the user
 * @returns
 */
export const verifyJWT = async (jwt: string): Promise<object | null> => {
    const [headerObject, payloadObject, givenSignature] = parseJWT(jwt);

    // parseJWT checks syntax
    const signingPayload = jwt.split(".").slice(0, 2).join(".");

    const header = jwtHeaderSchema(headerObject);

    if (header instanceof type.errors) {
        console.log({ header });
        return null;
    }

    const signingKey = await getSigningKey(header.kid);
    if (!signingKey) return null;

    const signature = hmac(SHA256, signingKey, new TextEncoder().encode(signingPayload));

    return uint8ArrayStrictEqual(givenSignature, signature) ? payloadObject : null;
};

/**
 * # updateJWT
 *
 * Given a JWT, decode it and update the payload with the partial payload, then
 * sign it and return it to be set as the token. This allows for consistency when
 * the user updates their Display Name, or Handle.
 *
 * @param jwt - the current JWT
 * @param updatedPayload  - the new properties
 * @returns a newly signed JWT with the updated payload
 */
export const updateJWT = async (jwt: string, updatedPayload: Partial<JWTPayload>) => {
    const { 1: payloadObject } = parseJWT(jwt);

    const payload = jwtPayloadType(payloadObject);

    if (payload instanceof type.errors) {
        throw payload;
    }

    Object.assign(payload, updatedPayload);

    return await signJWT(payload);
};
