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

    prepareSongFromContent(content: string): Partial<Song> {
        const parsedSong = this.parserService.parseSong(content);
        const songData: Partial<Song> = {
            title: parsedSong.title,
            subtitle: parsedSong.subtitle,
            lyricists: parsedSong.lyricists,
            albums: parsedSong.albums,
            arrangers: parsedSong.arrangers,
            artists: parsedSong.artists,
            composers: parsedSong.composers,
            copyright: parsedSong.copyright,
            capo: parsedSong.capo,
            duration: parsedSong.duration,
            tempo: parsedSong.tempo,
            time: parsedSong.time ? parsedSong.time.toString() : undefined,
            year: parsedSong.year,
            lyrics: parsedSong.getLyrics().join('\n'),
            lastUpdateDate: new Date(),
            content: parsedSong.rawContent,
            uniqueChords: parsedSong
                .getUniqueChords()
                .map((c) => c.toString()),
        };

        if (parsedSong.key) {
            songData.songKey = parsedSong.key.toString();
            songData.hasInferredKey = false;
        } else {
            const possibleKey = parsedSong.getPossibleKey();
            if (possibleKey) {
                songData.songKey = possibleKey.toString();
            }
            songData.hasInferredKey = true;
        }

        if (songData.songKey) {
            const letter = songData.songKey.includes('m') ? 'A' : 'C';
            const defaultKeySong = this.parserService.transposeSongToKey(
                parsedSong,
                letter
            );
            songData.defaultKeyUniqueChords = defaultKeySong
                .getUniqueChords()
                .map((c) => c.toString());
        }

        return Object.fromEntries(
            Object.entries(songData).filter(([, value]) => value !== undefined)
        );
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
