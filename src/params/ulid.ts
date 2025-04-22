import type { ParamMatcher } from '@sveltejs/kit';

const ULID_REGEX = /^[0-9A-HJKMNP-TV-Z]{26}$/;

export const match: ParamMatcher = ULID_REGEX.test;
