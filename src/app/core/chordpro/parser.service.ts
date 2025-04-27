import { Injectable } from '@angular/core';
import {
    ChordProParser,
    HtmlFormatter,
    MusicNote,
    Song,
    Transposer,
} from 'chordproject-parser';

@Injectable({
    providedIn: 'root',
})
export class ParserService {
    parseSong(content: string): Song {
        return new ChordProParser().parse(content);
    }

    formatToHtml(
        song: Song,
        showMetadata = false,
        showChords = true,
        showTabs = true
    ): string {
        const formatter = new HtmlFormatter();
        formatter.settings.showMetadata = showMetadata;
        formatter.settings.showChords = showChords;
        formatter.settings.showTabs = showTabs;
        return formatter.format(song).join('');
    }

    transposeSong(song: Song, newKey: string): Song {
        const newSong = Transposer.transpose(song, MusicNote.parse(newKey));
        return newSong;
    }
}
