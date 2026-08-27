import { BaseDocument } from './base-document';

export type SongbookSuggestionType = 'add_song' | 'new_child_songbook' | 'new_songbook' | 'other';
export type SongbookSuggestionStatus = 'open' | 'accepted' | 'rejected' | 'needs_review';

export class SongbookSuggestion extends BaseDocument {
    type: SongbookSuggestionType;
    status: SongbookSuggestionStatus;
    authorName?: string;
    targetSongbookId?: string;
    targetSongId?: string;
    targetParentId?: string;
    suggestedName?: string;
    message: string;
}
