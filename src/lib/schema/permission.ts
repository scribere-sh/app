// dprint-ignore-file

export const PERMISSION_BASE = "member";

export const PERMISSION_READ_SPACE = "space:read";
export const PERMISSION_WRITE_SPACE = "space:write";

export type Permission = 
    | typeof PERMISSION_BASE
    | typeof PERMISSION_READ_SPACE
    | typeof PERMISSION_WRITE_SPACE
;
