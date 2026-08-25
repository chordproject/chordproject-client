import { Injectable, inject } from '@angular/core';
import {
    Firestore,
    Timestamp,
    WriteBatch,
    collection,
    doc,
    getDoc,
    getDocs,
    serverTimestamp,
} from 'firebase/firestore';
import { Observable, defer, from, map, shareReplay } from 'rxjs';
import { Song } from 'app/models/song';
import {
    LYRICS_PREVIEW_LENGTH,
    SONG_INDEX_COLLECTION,
    SONG_INDEX_SHARD_SIZE,
    SONG_SEARCH_INDEX_COLLECTION,
    SongIndexEntry,
    SongIndexShard,
    SongSearchIndexEntry,
    SongSearchIndexShard,
    buildSearchText,
    songIndexShardId,
} from 'app/models/song-index';
import { FirebaseService } from '../firebase.service';

/**
 * Indice fragmentado de canciones. Evita leer la coleccion `songs` completa para pintar listas:
 * cada fragmento agrupa hasta SONG_INDEX_SHARD_SIZE canciones, asi que la biblioteca entera
 * cuesta tantas lecturas como fragmentos existan, no como canciones haya.
 */
@Injectable({
    providedIn: 'root',
})
export class SongIndexService {
    private _firestore: Firestore;
    private _shards$: Observable<SongIndexShard[]>;
    private _searchText$: Observable<Map<string, string>>;

    constructor() {
        this._firestore = inject(FirebaseService).firestore;
    }

    /** `null` cuando el indice aun no se ha generado, para que quien consuma haga fallback. */
    getEntries(): Observable<SongIndexEntry[] | null> {
        return this.getShards().pipe(
            map((shards) => (shards.length ? shards.flatMap((shard) => shard.songs) : null))
        );
    }

    /** Texto normalizado por cancion para buscar en letras. Se carga solo cuando se usa el buscador. */
    getSearchText(): Observable<Map<string, string> | null> {
        if (!this._searchText$) {
            this._searchText$ = defer(() =>
                from(getDocs(collection(this._firestore, SONG_SEARCH_INDEX_COLLECTION)))
            ).pipe(
                map((snapshot) => {
                    const text = new Map<string, string>();

                    snapshot.docs.forEach((shardDoc) => {
                        const shard = shardDoc.data() as SongSearchIndexShard;
                        (shard.entries || []).forEach((entry) => text.set(entry.uid, entry.text));
                    });

                    return text;
                }),
                shareReplay({ bufferSize: 1, refCount: false })
            );
        }

        return this._searchText$.pipe(map((text) => (text.size ? text : null)));
    }

    invalidate(): void {
        this._shards$ = null;
        this._searchText$ = null;
    }

    async stageUpsert(batch: WriteBatch, song: Song): Promise<void> {
        const shards = await this.readShards();
        const entry = this.buildEntry(song);
        const target =
            shards.find((shard) => shard.songs.some((indexed) => indexed.uid === entry.uid)) ??
            shards.find((shard) => shard.songs.length < SONG_INDEX_SHARD_SIZE) ??
            this.appendShard(shards);
        const songs = [...target.songs.filter((indexed) => indexed.uid !== entry.uid), entry];

        this.stageShard(batch, target.shard, songs);
        await this.stageSearchShard(batch, target.shard, entry.uid, buildSearchText(song));
    }

    async stageRemove(batch: WriteBatch, uid: string): Promise<void> {
        const shards = await this.readShards();
        const target = shards.find((shard) => shard.songs.some((indexed) => indexed.uid === uid));

        if (!target) {
            return;
        }

        this.stageShard(
            batch,
            target.shard,
            target.songs.filter((indexed) => indexed.uid !== uid)
        );
        await this.stageSearchShard(batch, target.shard, uid, null);
    }

    private getShards(): Observable<SongIndexShard[]> {
        if (!this._shards$) {
            this._shards$ = defer(() => from(this.readShards())).pipe(
                shareReplay({ bufferSize: 1, refCount: false })
            );
        }

        return this._shards$;
    }

    private async readShards(): Promise<SongIndexShard[]> {
        const snapshot = await getDocs(collection(this._firestore, SONG_INDEX_COLLECTION));

        return snapshot.docs
            .map((shardDoc) => {
                const shard = shardDoc.data() as SongIndexShard;

                return { shard: shard.shard, count: shard.count, songs: shard.songs || [] };
            })
            .sort((first, second) => first.shard - second.shard);
    }

    private appendShard(shards: SongIndexShard[]): SongIndexShard {
        const shard: SongIndexShard = { shard: shards.length, count: 0, songs: [] };
        shards.push(shard);

        return shard;
    }

    private stageShard(batch: WriteBatch, shard: number, songs: SongIndexEntry[]): void {
        batch.set(doc(this._firestore, SONG_INDEX_COLLECTION, songIndexShardId(shard)), {
            shard,
            count: songs.length,
            songs,
            updatedAt: serverTimestamp(),
        });
    }

    /** `text` a `null` elimina la entrada. Lee el fragmento porque el indice de busqueda no suele estar cargado. */
    private async stageSearchShard(
        batch: WriteBatch,
        shard: number,
        uid: string,
        text: string | null
    ): Promise<void> {
        const reference = doc(this._firestore, SONG_SEARCH_INDEX_COLLECTION, songIndexShardId(shard));
        const snapshot = await getDoc(reference);
        const current = snapshot.exists() ? ((snapshot.data() as SongSearchIndexShard).entries ?? []) : [];
        const entries: SongSearchIndexEntry[] = current.filter((entry) => entry.uid !== uid);

        if (text !== null) {
            entries.push({ uid, text });
        }

        batch.set(reference, { shard, count: entries.length, entries, updatedAt: serverTimestamp() });
    }

    private buildEntry(song: Song): SongIndexEntry {
        const entry: SongIndexEntry = {
            uid: song.uid,
            title: song.title ?? '',
            artists: song.artists ?? [],
            uniqueChords: song.uniqueChords ?? [],
            songKey: song.songKey ?? '',
            lyrics: (song.lyrics || '').slice(0, LYRICS_PREVIEW_LENGTH),
            // serverTimestamp() no es valido dentro de un array, se fija en cliente al crear.
            creationDate: song.creationDate instanceof Timestamp ? song.creationDate : Timestamp.now(),
        };

        if (song.subtitle) {
            entry.subtitle = song.subtitle;
        }
        if (song.variantOf) {
            entry.variantOf = song.variantOf;
        }

        return entry;
    }
}
