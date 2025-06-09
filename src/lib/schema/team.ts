export interface Team {
    id: string;

    handle: string;
    displayName: string;

    description: unknown;
}

export interface CardTeam extends Omit<Team, "description"> {
    memberCount: number;
    spaceCount: number;
}
