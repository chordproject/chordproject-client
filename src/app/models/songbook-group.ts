import { BaseDocument } from './base-document';

export class SongbookGroup extends BaseDocument {
    name: string;
    parentGroupId?: string;
    order?: number;
}

export type SongbookGroupWithChildren = {
    group: SongbookGroup;
    songbooks: import('./songbook').Songbook[];
};
