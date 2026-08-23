import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Song } from 'app/models/song';
import { SongService } from '../firebase/api/song.service';
import { ParserService } from './parser.service';

@Injectable({
    providedIn: 'root',
})
export class EditorService {
    constructor(
        private parserService: ParserService,
        private confirmationService: FuseConfirmationService,
        private songService: SongService
    ) {}

    prepareSongFromContent(content: string): Song {
        const parsedSong = this.parserService.parseSong(content);
        const song = new Song();

        song.title = parsedSong.title;
        song.subtitle = parsedSong.subtitle;
        song.lyricists = parsedSong.lyricists;
        song.albums = parsedSong.albums;
        song.arrangers = parsedSong.arrangers;
        song.artists = parsedSong.artists;
        song.composers = parsedSong.composers;
        song.copyright = parsedSong.copyright;
        song.capo = parsedSong.capo;
        song.duration = parsedSong.duration;
        song.tempo = parsedSong.tempo;
        song.time = parsedSong.time ? parsedSong.time.toString() : null;
        song.year = parsedSong.year;
        song.lyrics = parsedSong.getLyrics().join('\n');
        song.lastUpdateDate = new Date();
        song.content = parsedSong.rawContent;
        song.uniqueChords = parsedSong
            .getUniqueChords()
            .map((c) => c.toString());

        if (parsedSong.key) {
            song.songKey = parsedSong.key.toString();
            song.hasInferredKey = false;
        } else {
            const possibleKey = parsedSong.getPossibleKey();
            if (possibleKey) {
                song.songKey = possibleKey.toString();
            }
            song.hasInferredKey = true;
        }

        song.songKey = song.songKey || null;

        if (song.songKey) {
            const letter = song.songKey.includes('m') ? 'A' : 'C';
            const defaultKeySong = this.parserService.transposeSong(
                parsedSong,
                letter
            );
            song.defaultKeyUniqueChords = defaultKeySong
                .getUniqueChords()
                .map((c) => c.toString());
        }

        return song;
    }

    confirmAndDelete(song: Song): Observable<boolean> {
        return this.confirmationService
            .open({
                title: 'editor.delete_song_title',
                message: 'editor.delete_song_message',
                actions: {
                    confirm: {
                        label: 'editor.delete_song_confirm',
                    },
                },
            })
            .afterClosed()
            .pipe(
                map(async (result) => {
                    if (result === 'confirmed' && song.uid) {
                        return await this.songService.delete(song.uid);
                    }
                    return false;
                }),
                switchMap((promise) => from(promise))
            );
    }
}
