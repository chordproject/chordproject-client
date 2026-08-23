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

    transposeSong(song: Song, direction: 'up' | 'down'): Song {
        return Transposer.transpose(song, direction);
    }

    transposeSongToKey(song: Song, newKey: string): Song {
        const targetNote = MusicNote.parse(newKey);
        const currentKey = song.key ?? song.getPossibleKey();

        if (!targetNote || !currentKey) {
            return song;
        }

        const pitchClasses: Record<string, number> = {
            C: 0,
            'C#': 1,
            Db: 1,
            D: 2,
            'D#': 3,
            Eb: 3,
            E: 4,
            F: 5,
            'F#': 6,
            Gb: 6,
            G: 7,
            'G#': 8,
            Ab: 8,
            A: 9,
            'A#': 10,
            Bb: 10,
            B: 11,
        };
        const currentPitchClass = pitchClasses[currentKey.note.toString()];
        const targetPitchClass = pitchClasses[targetNote.toString()];

        if (currentPitchClass === undefined || targetPitchClass === undefined) {
            return song;
        }

        let transposedSong = song;
        const upwardSteps = (targetPitchClass - currentPitchClass + 12) % 12;
        const downwardSteps = (currentPitchClass - targetPitchClass + 12) % 12;
        const direction = upwardSteps <= downwardSteps ? 'up' : 'down';
        const steps = Math.min(upwardSteps, downwardSteps);

        for (let step = 0; step < steps; step++) {
            transposedSong = Transposer.transpose(transposedSong, direction);
        }

        return transposedSong;
    }
}
