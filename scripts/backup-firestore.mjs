#!/usr/bin/env node

import { applicationDefault, cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const DEFAULT_PROJECT_ID = 'homenajesus-app';

const args = parseArgs(process.argv.slice(2));

if (args.help) {
    printHelp();
    process.exit(0);
}

const projectId = args.project || process.env.FIREBASE_PROJECT_ID || DEFAULT_PROJECT_ID;
const outputPath = args.out || getDefaultOutputPath(projectId, args.timestamped);
const selectedCollectionIds = args.collections ? parseCollectionIds(args.collections) : null;
const documentLimit = args.limit ? parseLimit(args.limit) : null;

try {
    initializeApp({
        credential: await getCredential(args.credentials),
        projectId,
    });

    const firestore = getFirestore();
    const startedAt = new Date();
    let documentCount = 0;
    const collectionBackups = new Map();

    const collections = await exportCollections(firestore, true);
    const manifest = {
        format: 'firestore-json-backup-v1',
        projectId,
        exportedAt: startedAt.toISOString(),
        partial: Boolean(selectedCollectionIds || documentLimit),
        filters: {
            collections: selectedCollectionIds,
            limitPerCollection: documentLimit,
        },
        documentCount,
        collections,
        files: Array.from(collectionBackups.values())
            .map(({ path: collectionPath, count, file }) => ({
                collectionPath,
                count,
                file,
            }))
            .sort((first, second) => first.collectionPath.localeCompare(second.collectionPath)),
    };

    await writeBackupDirectory(outputPath, manifest, collectionBackups);

    console.log(`Exported ${documentCount} documents from ${projectId}`);
    console.log(`Backup written to ${outputPath}`);

    async function exportCollections(parentRef, isRoot = false) {
        const collectionRefs = await parentRef.listCollections();
        const exportableCollectionRefs = isRoot && selectedCollectionIds
            ? collectionRefs.filter((collectionRef) => selectedCollectionIds.includes(collectionRef.id))
            : collectionRefs;
        const entries = await Promise.all(
            exportableCollectionRefs
                .sort((first, second) => first.id.localeCompare(second.id))
                .map(async (collectionRef) => [collectionRef.id, await exportCollection(collectionRef)])
        );

        return Object.fromEntries(entries);
    }

    async function exportCollection(collectionRef) {
        const snapshot = documentLimit ? await collectionRef.limit(documentLimit).get() : await collectionRef.get();
        const file = path.join('collections', `${toFileName(collectionRef.path)}.json`);
        const documents = [];
        const documentSummaries = {};

        for (const documentSnapshot of snapshot.docs.sort((first, second) => first.id.localeCompare(second.id))) {
            documentCount += 1;
            const data = serializeValue(documentSnapshot.data());
            const document = {
                id: documentSnapshot.id,
                path: documentSnapshot.ref.path,
                collectionPath: collectionRef.path,
                data,
                collections: await exportCollections(documentSnapshot.ref),
            };

            documents.push(document);
            documentSummaries[documentSnapshot.id] = {
                path: document.path,
                collections: document.collections,
            };
        }

        collectionBackups.set(collectionRef.path, {
            path: collectionRef.path,
            count: snapshot.size,
            file,
            documents,
        });

        return {
            path: collectionRef.path,
            file,
            count: snapshot.size,
            documents: documentSummaries,
        };
    }
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
}

async function getCredential(credentialsPath) {
    const serviceAccountPath = credentialsPath || process.env.GOOGLE_APPLICATION_CREDENTIALS;

    if (!serviceAccountPath) {
        return applicationDefault();
    }

    const rawServiceAccount = await readFile(path.resolve(serviceAccountPath), 'utf8');
    return cert(JSON.parse(rawServiceAccount));
}

function serializeValue(value) {
    if (value === null || typeof value !== 'object') {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map(serializeValue);
    }

    if (value instanceof Date) {
        return { __type: 'date', value: value.toISOString() };
    }

    if (typeof value.toDate === 'function' && typeof value.toMillis === 'function') {
        return {
            __type: 'timestamp',
            value: value.toDate().toISOString(),
            seconds: value.seconds,
            nanoseconds: value.nanoseconds,
        };
    }

    if (typeof value.latitude === 'number' && typeof value.longitude === 'number') {
        return {
            __type: 'geoPoint',
            latitude: value.latitude,
            longitude: value.longitude,
        };
    }

    if (value.path && value.firestore && value.id) {
        return { __type: 'documentReference', path: value.path };
    }

    if (typeof value.toBase64 === 'function') {
        return { __type: 'bytes', value: value.toBase64() };
    }

    return Object.fromEntries(
        Object.entries(value).map(([key, fieldValue]) => [key, serializeValue(fieldValue)])
    );
}

function parseArgs(argv) {
    const parsedArgs = {};

    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];

        if (arg === '--help' || arg === '-h') {
            parsedArgs.help = true;
        } else if (arg === '--timestamped') {
            parsedArgs.timestamped = true;
        } else if (arg === '--collection' || arg === '--collections') {
            parsedArgs.collections = argv[++index];
        } else if (arg === '--limit') {
            parsedArgs.limit = argv[++index];
        } else if (arg === '--project') {
            parsedArgs.project = argv[++index];
        } else if (arg === '--out') {
            parsedArgs.out = argv[++index];
        } else if (arg === '--credentials') {
            parsedArgs.credentials = argv[++index];
        } else {
            throw new Error(`Unknown argument: ${arg}`);
        }
    }

    return parsedArgs;
}

function parseCollectionIds(collections) {
    const collectionIds = collections
        .split(',')
        .map((collectionId) => collectionId.trim())
        .filter(Boolean);

    if (collectionIds.length === 0) {
        throw new Error('--collections must include at least one collection ID');
    }

    return collectionIds;
}

function parseLimit(limit) {
    const parsedLimit = Number.parseInt(limit, 10);

    if (!Number.isSafeInteger(parsedLimit) || parsedLimit < 1) {
        throw new Error('--limit must be a positive integer');
    }

    return parsedLimit;
}

function getDefaultOutputPath(projectId, timestamped) {
    const suffix = timestamped ? new Date().toISOString().replace(/[:.]/g, '-') : 'latest';

    return path.join('backups', `firestore-${projectId}-${suffix}`);
}

async function writeBackupDirectory(outputPath, manifest, collectionBackups) {
    const temporaryOutputPath = `${outputPath}.tmp`;

    await rm(temporaryOutputPath, { recursive: true, force: true });
    await mkdir(path.join(temporaryOutputPath, 'collections'), { recursive: true });
    await writeJson(path.join(temporaryOutputPath, 'manifest.json'), manifest);

    for (const collectionBackup of collectionBackups.values()) {
        await writeJson(path.join(temporaryOutputPath, collectionBackup.file), collectionBackup);
    }

    await rm(outputPath, { recursive: true, force: true });
    await rename(temporaryOutputPath, outputPath);
}

async function writeJson(filePath, value) {
    await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function toFileName(collectionPath) {
    return collectionPath.replace(/[^a-z0-9_-]+/gi, '__');
}

function printHelp() {
        console.log([
                'Usage: node scripts/backup-firestore.mjs [options]',
                '',
                'Options:',
                '  --project <project-id>      Firebase project ID. Defaults to homenajesus-app.',
                '  --credentials <path>        Service account JSON path. Defaults to GOOGLE_APPLICATION_CREDENTIALS.',
                '  --out <path>                Output directory. Defaults to backups/firestore-<project>-latest.',
                '  --collections <ids>         Comma-separated top-level collection IDs to export.',
                '  --limit <number>            Maximum documents to export per collection query.',
                '  --timestamped               Write a timestamped backup instead of replacing the latest one.',
                '  -h, --help                  Show this help.',
        ].join('\n'));
}