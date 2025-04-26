import { decodeBase32, encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";

/**
 * # generateTokenBytes
 *
 * Generate a bunch of bytes.
 *
 * @param length - the amount of bytes to generate
 * @returns a {@link Uint8Array} with cryptographically-secure random values
 */
export const generateTokenBytes = (length: number) => {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);

    return bytes;
};

/**
 * # generateTokenString
 *
 * Generate a bunch of bytes using {@link generateTokenBytes} then encode them using {@link encodeTokenBytes}
 *
 * @param length - the amount of bytes to generate
 * @returns a token-esque string
 */
export const generateTokenString = (length: number) => {
    const bytes = generateTokenBytes(length);
    return encodeTokenBytes(bytes);
};

/**
 * # encodeTokenBytes
 *
 * Encode bytes in base32
 *
 * @param bytes - the bytes to encode to a string
 * @returns the provided bytes encoded in base32
 */
export const encodeTokenBytes = (bytes: Uint8Array) => {
    return encodeBase32LowerCaseNoPadding(bytes);
};

/**
 * # decodeTokenString
 *
 * Decode bytes from a base32 string
 *
 * @param token - a base32 encoded string
 * @returns the bytes represented by the token
 */
export const decodeTokenString = (token: string) => {
    return decodeBase32(token);
};
