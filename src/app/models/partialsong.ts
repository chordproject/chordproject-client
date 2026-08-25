export class PartialSong {
    uid: string;
    arrangers?: string[];
    artists?: string[];
    capo?: number;
    composers?: string[];
    content?: string;
    creationDate?: unknown;
    lyrics?: string;
    lyricists?: string[];
    songKey?: string;
    subtitle?: string;
    tempo?: number;
    time?: string;
    title?: string;
    uniqueChords: string[];
    year?: number;
    variantOf?: string;
}

export type SongSortField = 'title' | 'artists' | 'creationDate';

export type SongSortDirection = 'asc' | 'desc';

export type SongSort = {
    field: SongSortField;
    direction: SongSortDirection;
}

export const SONG_SORT_FIELDS: SongSortField[] = ['title', 'artists', 'creationDate'];

export const DEFAULT_SONG_SORT: SongSort = { field: 'title', direction: 'asc' };

