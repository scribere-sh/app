// dprint-ignore-file

export const PERMISSION_BASE = "member";

export const PERMISSION_READ_SPACE = "space:read";
export const PERMISSION_WRITE_SPACE = "space:write";

// export const PERMISSION_SPACE_OWNER = "space:owner";

export const PERMISSION_UPDATE_TEAM = "team:update";
export const PERMISSION_TEAM_OWNER = "team:owner";

export const Permissions = [
    PERMISSION_BASE,
    PERMISSION_READ_SPACE,
    PERMISSION_WRITE_SPACE,
    // PERMISSION_SPACE_OWNER,
    PERMISSION_UPDATE_TEAM,
    PERMISSION_TEAM_OWNER
] as const;

export type Permission = typeof Permissions[number];
