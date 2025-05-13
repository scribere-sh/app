import { generateTokenBytes } from "$srv/auth/token";
import { shake128 } from "@oslojs/crypto/sha3";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";

export const generateUid = () => {
    const uidBytes = generateTokenBytes(32);
    const hashedUid = shake128(16, uidBytes);

    return encodeBase32LowerCaseNoPadding(hashedUid);
};
