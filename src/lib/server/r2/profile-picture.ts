import type { R2GetOptions } from "@cloudflare/workers-types";
import type { R2UploadInput } from ".";

import { getRequestEvent } from "$app/server";

import { shake256 } from "@oslojs/crypto/sha3";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";

export const uploadProfilePicture = (userId: string, image: R2UploadInput) => {
    const { platform } = getRequestEvent();
    if (!platform) throw new Error("unable to access platform apis");

    const hashedUserId = encodeBase32LowerCaseNoPadding(shake256(32, new TextEncoder().encode(userId)));

    return platform.env.R2.put(`profile-pictures/${hashedUserId}`, image);
};

export const getUserProfilePicture = async (userId: string, options?: R2GetOptions) => {
    const { platform } = getRequestEvent();
    if (!platform) throw new Error("unable to access platform apis");

    const hashedUserId = encodeBase32LowerCaseNoPadding(shake256(32, new TextEncoder().encode(userId)));

    return platform.env.R2.get(`profile-pictures/${hashedUserId}`, options);
};
