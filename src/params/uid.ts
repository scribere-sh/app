import type { ParamMatcher } from "@sveltejs/kit";

// base32 lowercase encoding fetched from source of @oslojs/encoding
const UID_REGEX = /^[abcdefghijklmnopqrstuvwxyz234567]{3,100}$/;

export const match: ParamMatcher = (param): param is string => {
    return UID_REGEX.test(param);
};
