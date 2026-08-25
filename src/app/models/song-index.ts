import { PartialSong } from './partialsong';

export const SONG_INDEX_COLLECTION = 'song_index';

export const SONG_SEARCH_INDEX_COLLECTION = 'song_search_index';

/** Con ~310 bytes por entrada, 500 deja cada fragmento muy por debajo del limite de 1 MB por documento. */
export const SONG_INDEX_SHARD_SIZE = 500;

export const LYRICS_PREVIEW_LENGTH = 140;

/** Entrada ligera: misma forma que PartialSong pero con `lyrics` recortado y sin `content`. */
export type SongIndexEntry = PartialSong;

export type SongIndexShard = {
    shard: number;
    count: number;
    songs: SongIndexEntry[];
}

export type SongSearchIndexEntry = {
    uid: string;
    text: string;
}

export type SongSearchIndexShard = {
    shard: number;
    count: number;
    entries: SongSearchIndexEntry[];
}

export function songIndexShardId(shard: number): string {
    return `songs_${String(shard).padStart(3, '0')}`;
}

export function normalizeText(value: string): string {
    return (value || '')
        .toLocaleLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

export function buildSearchText(song: PartialSong): string {
    return normalizeText([song.title, (song.artists || []).join(' '), song.lyrics].filter(Boolean).join(' '))
        .replace(/\s+/g, ' ')
        .trim();
}
