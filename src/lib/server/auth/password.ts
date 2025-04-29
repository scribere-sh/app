import { getRequestEvent } from "$app/server";

import { sha1 } from "@oslojs/crypto/sha1";
import { encodeHexLowerCase } from "@oslojs/encoding";

const sha1password = (password: string) => encodeHexLowerCase(sha1(new TextEncoder().encode(password)));

export const checkPasswordStrength = async (password: string) => {
    // check password length as shown
    if (password.length < 12) {
        return false;
    }

    const { request: { signal } } = getRequestEvent();

    // perform check
    //
    // based on the following repo (0BSD Licensed)
    //
    // credit of this implementation to PilcrowOnPaper and Lucia Auth contributors.
    //
    // https://github.com/lucia-auth/example-sveltekit-email-password-2fa/blob/main/src/lib/server/password.ts
    const hash = sha1password(password);
    const hashPrefix = hash.slice(0, 5);
    const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`, { signal });
    const data = await response.text();
    const items = data.split("\n");

    const found = items.find((val) => {
        const hashSuffix = val.slice(0, 35).toLowerCase();
        return hash == hashPrefix + hashSuffix;
    });

    return found === undefined;
};
