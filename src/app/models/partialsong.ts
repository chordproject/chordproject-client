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
    variantCount?: number;
}

export type SongSortField = 'title' | 'artists' | 'creationDate';

export type SongSortDirection = 'asc' | 'desc';

export type SongSort = {
    field: SongSortField;
    direction: SongSortDirection;
}

export const SONG_SORT_FIELDS: SongSortField[] = ['title', 'artists', 'creationDate'];

/** Al cambiar de campo se aplica su direccion natural: alfabetica de la A a la Z, fechas de la mas reciente. */
export const SONG_SORT_DEFAULT_DIRECTION: Record<SongSortField, SongSortDirection> = {
    title: 'asc',
    artists: 'asc',
    creationDate: 'desc',
};

export const DEFAULT_SONG_SORT: SongSort = { field: 'title', direction: 'asc' };

