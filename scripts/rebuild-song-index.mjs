#!/usr/bin/env node

import { applicationDefault, cert, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const DEFAULT_PROJECT_ID = 'homenajesus-app';
const SONG_INDEX_COLLECTION = 'song_index';
const SONG_SEARCH_INDEX_COLLECTION = 'song_search_index';
const SHARD_SIZE = 500;
const LYRICS_PREVIEW_LENGTH = 140;

const args = parseArgs(process.argv.slice(2));

if (args.help) {
    printHelp();
    process.exit(0);
}

const projectId = args.project || process.env.FIREBASE_PROJECT_ID || DEFAULT_PROJECT_ID;

try {
    initializeApp({ credential: await getCredential(args.credentials), projectId });

    const firestore = getFirestore();
    const songs = await readSongs(firestore);
    const shards = chunk(songs, SHARD_SIZE);

    console.log(`${songs.length} canciones leidas de ${projectId}`);
    console.log(`${shards.length} fragmentos de hasta ${SHARD_SIZE} entradas`);

    if (args['dry-run']) {
        reportSizes(shards);
        console.log('Dry run: no se escribio nada.');
        process.exit(0);
    }

    await clearCollection(firestore, SONG_INDEX_COLLECTION);
    await clearCollection(firestore, SONG_SEARCH_INDEX_COLLECTION);

    for (const [position, shardSongs] of shards.entries()) {
        const shardId = `songs_${String(position).padStart(3, '0')}`;

        await firestore
            .collection(SONG_INDEX_COLLECTION)
            .doc(shardId)
            .set({
                shard: position,
                count: shardSongs.length,
                songs: shardSongs.map(buildEntry),
                updatedAt: FieldValue.serverTimestamp(),
            });

        await firestore
            .collection(SONG_SEARCH_INDEX_COLLECTION)
            .doc(shardId)
            .set({
                shard: position,
                count: shardSongs.length,
                entries: shardSongs.map((song) => ({ uid: song.uid, text: buildSearchText(song) })),
                updatedAt: FieldValue.serverTimestamp(),
            });

        console.log(`${shardId}: ${shardSongs.length} canciones`);
    }

    reportSizes(shards);
    console.log('Indice reconstruido.');
    process.exit(0);
} catch (error) {
    console.error('No se pudo reconstruir el indice:', error.message);
    process.exit(1);
}

async function readSongs(firestore) {
    const snapshot = await firestore.collection('songs').orderBy('title').get();

    return snapshot.docs.map((document) => ({ ...document.data(), uid: document.id }));
}

function buildEntry(song) {
    const entry = {
        uid: song.uid,
        title: song.title ?? '',
        artists: song.artists ?? [],
        uniqueChords: song.uniqueChords ?? [],
        songKey: song.songKey ?? '',
        lyrics: (song.lyrics || '').slice(0, LYRICS_PREVIEW_LENGTH),
        creationDate: song.creationDate ?? null,
    };

    if (song.subtitle) {
        entry.subtitle = song.subtitle;
    }
    if (song.variantOf) {
        entry.variantOf = song.variantOf;
    }

    return entry;
}

function normalizeText(value) {
    return (value || '')
        .toLocaleLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function buildSearchText(song) {
    return normalizeText([song.title, (song.artists || []).join(' '), song.lyrics].filter(Boolean).join(' '))
        .replace(/\s+/g, ' ')
        .trim();
}

function chunk(items, size) {
    return Array.from({ length: Math.ceil(items.length / size) || 1 }, (_, position) =>
        items.slice(position * size, (position + 1) * size)
    );
}

/** Avisa si algun fragmento se acerca al limite de 1 MB por documento de Firestore. */
function reportSizes(shards) {
    shards.forEach((shardSongs, position) => {
        const light = Buffer.byteLength(JSON.stringify(shardSongs.map(buildEntry)), 'utf8');
        const search = Buffer.byteLength(
            JSON.stringify(shardSongs.map((song) => ({ uid: song.uid, text: buildSearchText(song) }))),
            'utf8'
        );

        console.log(
            `fragmento ${position}: ligero ${Math.round(light / 1024)} KB, busqueda ${Math.round(search / 1024)} KB`
        );

        if (light > 700 * 1024 || search > 700 * 1024) {
            console.warn(`fragmento ${position} supera 700 KB, reducir SHARD_SIZE`);
        }
    });
}

async function clearCollection(firestore, collectionId) {
    const snapshot = await firestore.collection(collectionId).get();

    if (snapshot.empty) {
        return;
    }

    const batch = firestore.batch();
    snapshot.docs.forEach((document) => batch.delete(document.ref));
    await batch.commit();
}

async function getCredential(credentialsPath) {
    const serviceAccountPath = credentialsPath || process.env.GOOGLE_APPLICATION_CREDENTIALS;

    if (!serviceAccountPath) {
        return applicationDefault();
    }

    const rawServiceAccount = await readFile(path.resolve(serviceAccountPath), 'utf8');
    return cert(JSON.parse(rawServiceAccount));
}

function parseArgs(argv) {
    const parsed = {};

    for (let position = 0; position < argv.length; position += 1) {
        const token = argv[position];

        if (!token.startsWith('--')) {
            continue;
        }

        const key = token.slice(2);

        if (key === 'help' || key === 'dry-run') {
            parsed[key] = true;
            continue;
        }

        parsed[key] = argv[position + 1];
        position += 1;
    }

    return parsed;
}

function printHelp() {
    console.log(`Reconstruye ${SONG_INDEX_COLLECTION} y ${SONG_SEARCH_INDEX_COLLECTION} desde la coleccion songs.

Uso:
  node scripts/rebuild-song-index.mjs [--project <id>] [--credentials <ruta>] [--dry-run]

Opciones:
  --project      Proyecto de Firebase. Por defecto ${DEFAULT_PROJECT_ID}.
  --credentials  Ruta al service account. Por defecto GOOGLE_APPLICATION_CREDENTIALS.
  --dry-run      Calcula fragmentos y tamanos sin escribir nada.
`);
}
