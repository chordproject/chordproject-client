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
        const targetNote = MusicNote.parse(newKey);
        const currentKey = song.key ?? song.getPossibleKey();

        if (!targetNote || !currentKey) {
            return song;
        }

        const semitoneByNote = new Map<string, number>([
            ['C', 0],
            ['C#', 1],
            ['Db', 1],
            ['D', 2],
            ['D#', 3],
            ['Eb', 3],
            ['E', 4],
            ['F', 5],
            ['F#', 6],
            ['Gb', 6],
            ['G', 7],
            ['G#', 8],
            ['Ab', 8],
            ['A', 9],
            ['A#', 10],
            ['Bb', 10],
            ['B', 11],
        ]);
        const currentSemitone = semitoneByNote.get(currentKey.note.toString());
        const targetSemitone = semitoneByNote.get(targetNote.toString());

        if (currentSemitone === undefined || targetSemitone === undefined) {
            return song;
        }

        let transposedSong = song;
        const upSteps = (targetSemitone - currentSemitone + 12) % 12;
        const downSteps = (currentSemitone - targetSemitone + 12) % 12;
        const direction = upSteps <= downSteps ? 'up' : 'down';
        const steps = Math.min(upSteps, downSteps);

        for (let step = 0; step < steps; step++) {
            transposedSong = Transposer.transpose(transposedSong, direction);
        }

        return transposedSong;
    }
}
