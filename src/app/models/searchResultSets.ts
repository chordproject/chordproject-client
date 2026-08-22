import { PartialSong } from './partialsong';
import { Songbook } from './songbook';

export type SearchResultSets = {
    songs: PartialSong[];
    songbooks: Songbook[];
    songsInSongbooks: { songbook: Songbook; songs: PartialSong[] }[];
}
