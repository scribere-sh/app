import { generateTokenBytes } from "$srv/auth/token";
import { sha1 } from "@oslojs/crypto/sha1";
import { encodeBase32LowerCase } from "@oslojs/encoding";

export const generateUid = () => {
    const uidBytes = generateTokenBytes(32);
    const hashedUid = sha1(uidBytes);

    return encodeBase32LowerCase(hashedUid);
};
