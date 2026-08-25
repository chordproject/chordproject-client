export class BaseDocument {
    uid: string;
    creationDate: unknown;
    lastUpdateDate: Date;
    authorId: string;
    ownerId?: string;
    source: string;
    scope?: 'personal' | 'shared';
    published?: boolean;
    isTemplate?: boolean;
    copiedFrom?: string;
    syncStatus?: 'synced' | 'customized';
    lastSyncedAt?: unknown;
    customizedAt?: unknown;
    deleted?: boolean;
    deletedAt?: unknown;
}
