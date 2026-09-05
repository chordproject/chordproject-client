export type MusicGroupRole = 'owner' | 'admin' | 'member';

export type MusicGroup = {
    uid: string;
    name: string;
    code: string;
    ownerId: string;
    status: 'active';
    creationDate: unknown;
    lastUpdateDate?: unknown;
};

export type MusicGroupMembership = {
    uid: string;
    groupId: string;
    userId: string;
    role: MusicGroupRole;
    status: 'active';
    creationDate: unknown;
};
