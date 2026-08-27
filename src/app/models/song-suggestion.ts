import { BaseDocument } from './base-document';

export type SongSuggestionStatus = 'open' | 'accepted' | 'rejected';
export type SongSuggestionOutcome = 'official' | 'version';

// Editable song fields a suggestion can propose changes for.
export type SongSuggestionProposedFields = {
    title?: string;
    subtitle?: string;
    content?: string;
    lyrics?: string;
    albums?: string[];
    arrangers?: string[];
    artists?: string[];
    composers?: string[];
    lyricists?: string[];
    copyright?: string;
    songKey?: string;
    uniqueChords?: string[];
    defaultKeyUniqueChords?: string[];
    capo?: number;
    tempo?: number;
    time?: string;
    duration?: number;
    year?: number;
};

export class SongSuggestion extends BaseDocument {
    targetSongId: string;
    proposedSong: SongSuggestionProposedFields;
    proposedOutcome: SongSuggestionOutcome;
    authorName?: string;
    message?: string;
    status: SongSuggestionStatus;
    responseMessage?: string;
    resultSongId?: string;
}
