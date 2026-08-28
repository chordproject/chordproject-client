#!/usr/bin/env node

import { applicationDefault, cert, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const DEFAULT_PROJECT_ID = 'homenajesus-app';
const args = parseArgs(process.argv.slice(2));
const projectId = args.project || process.env.FIREBASE_PROJECT_ID || DEFAULT_PROJECT_ID;

if (args.help) {
    printHelp();
    process.exit(0);
}

try {
    initializeApp({ credential: await getCredential(args.credentials), projectId });
    const firestore = getFirestore();
    const songbooks = await readSongbooks(firestore);
    const relations = await readRelations(firestore);
    const groups = findGroups(songbooks, relations);

    console.log(`${songbooks.length} cancioneros leidos de ${projectId}`);
    console.log(`${groups.length} grupos candidatos encontrados`);
    groups.forEach(({ group, children }) => {
        console.log(`- ${group.name} [${group.uid}] scope=${group.scope || '-'} source=${group.source || '-'} copiedFrom=${group.copiedFrom || '-'}: ${children.length} miembros`);
    });

    if (!args.apply) {
        console.log('Dry run: no se escribio nada. Usa --apply para crear los grupos y sus miembros.');
        process.exit(0);
    }

    await writeGroups(firestore, groups);
    if (args['cleanup-legacy']) {
        await cleanupLegacy(firestore, groups);
    }
    console.log(`Migracion completada: ${groups.length} grupos y sus miembros escritos.`);
} catch (error) {
    console.error('No se pudo migrar la agrupacion de cancioneros:', error instanceof Error ? error.message : error);
    process.exit(1);
}

async function readSongbooks(firestore) {
    const snapshot = await firestore.collection('songbooks').get();
    return snapshot.docs.map((document) => ({ ...document.data(), uid: document.id }));
}

async function readRelations(firestore) {
    const snapshot = await firestore.collection('songbook_songs').get();
    return snapshot.docs
        .filter((document) => document.data().deleted !== true)
        .map((document) => document.data());
}

function findGroups(songbooks, relations) {
    const songIdsBySongbook = new Map();
    relations.forEach((relation) => {
        const songIds = songIdsBySongbook.get(relation.songbookId) || new Set();
        songIds.add(relation.songId);
        songIdsBySongbook.set(relation.songbookId, songIds);
    });

    return songbooks
        .map((group) => ({
            group,
            children: songbooks
                .filter((songbook) => songbook.parent === group.uid)
                .sort(compareOrder),
        }))
        .filter(({ group, children }) =>
            group.deleted !== true &&
            children.length > 0 &&
            !(songIdsBySongbook.get(group.uid)?.size)
        );
}

async function writeGroups(firestore, groups) {
    let batch = firestore.batch();
    let writes = 0;

    for (const { group, children } of groups) {
        const groupRef = firestore.collection('songbook_groups').doc(group.uid);
        batch.set(groupRef, buildGroupData(group), { merge: true });
        writes += 1;

        for (const [index, child] of children.entries()) {
            const memberRef = firestore.collection('songbook_group_members').doc(`${group.uid}_${child.uid}`);
            batch.set(memberRef, {
                groupId: group.uid,
                songbookId: child.uid,
                order: Number(child.order ?? index),
                sourceSongbookId: group.uid,
            }, { merge: true });
            writes += 1;

            if (writes === 400) {
                await batch.commit();
                batch = firestore.batch();
                writes = 0;
            }
        }
    }

    if (writes > 0) {
        await batch.commit();
    }
}

async function cleanupLegacy(firestore, groups) {
    const groupIds = new Set(groups.map(({ group }) => group.uid));
    const songbooksSnapshot = await firestore.collection('songbooks').get();
    const relationsSnapshot = await firestore.collection('songbook_songs').get();
    const containerIds = songbooksSnapshot.docs
        .filter((document) => groupIds.has(document.id))
        .filter((document) => !relationsSnapshot.docs.some((relation) => relation.data().songbookId === document.id && relation.data().deleted !== true))
        .map((document) => document.id);

    console.log(`Limpieza legacy: ${containerIds.length} contenedores y ${songbooksSnapshot.size - containerIds.length} cancioneros actualizados.`);
    let batch = firestore.batch();
    let writes = 0;

    for (const document of songbooksSnapshot.docs) {
        if (containerIds.includes(document.id)) {
            batch.delete(document.ref);
        } else {
            batch.update(document.ref, {
                parent: FieldValue.delete(),
                order: FieldValue.delete(),
                isReorderable: FieldValue.delete(),
            });
        }
        writes += 1;
        if (writes === 400) {
            await batch.commit();
            batch = firestore.batch();
            writes = 0;
        }
    }

    for (const document of relationsSnapshot.docs) {
        batch.update(document.ref, { order: FieldValue.delete() });
        writes += 1;
        if (writes === 400) {
            await batch.commit();
            batch = firestore.batch();
            writes = 0;
        }
    }

    if (writes > 0) {
        await batch.commit();
    }
}

function buildGroupData(songbook) {
    return {
        name: songbook.name || '',
        order: Number(songbook.order ?? 0),
        parentGroupId: null,
        authorId: songbook.authorId || null,
        ownerId: songbook.ownerId || null,
        scope: songbook.scope || 'shared',
        published: songbook.published === true,
        isTemplate: songbook.isTemplate === true,
        source: 'songbook-group-migration',
        sourceSongbookId: songbook.uid,
        copiedFrom: songbook.copiedFrom || null,
        migratedAt: new Date(),
    };
}

function compareOrder(first, second) {
    return Number(first.order ?? 0) - Number(second.order ?? 0) || String(first.name || '').localeCompare(String(second.name || ''), 'es');
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
    for (let index = 0; index < argv.length; index += 1) {
        const argument = argv[index];
        if (argument === '--apply') parsed.apply = true;
        else if (argument === '--cleanup-legacy') parsed['cleanup-legacy'] = true;
        else if (argument === '--help' || argument === '-h') parsed.help = true;
        else if (argument === '--project') parsed.project = argv[++index];
        else if (argument === '--credentials') parsed.credentials = argv[++index];
    }
    return parsed;
}

function printHelp() {
    console.log(`Uso: node scripts/migrate-songbook-groups.mjs [opciones]

Por defecto solo informa los grupos candidatos.
    --apply                    Escribe songbook_groups y sus miembros.
    --cleanup-legacy           Con --apply, elimina contenedores legacy sin canciones y campos parent/order antiguos.
  --project <id>             Proyecto Firebase. Por defecto: homenajesus-app.
  --credentials <path>       JSON de cuenta de servicio.
  --help                     Muestra esta ayuda.`);
}
