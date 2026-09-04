#!/usr/bin/env node

import { applicationDefault, cert, initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const DEFAULT_PROJECT_ID = 'homenajesus-app';
const args = parseArgs(process.argv.slice(2));
const projectId = args.project || process.env.FIREBASE_PROJECT_ID || DEFAULT_PROJECT_ID;

if (!args.adminUid) {
    console.error('Usage: node scripts/migrate-repertoires-to-shared.mjs --admin-uid <firebaseUid> [--dry-run] [options]');
    process.exit(1);
}

try {
    initializeApp({
        credential: await getCredential(args.credentials),
        projectId,
    });

    const firestore = getFirestore();
    const snapshot = await firestore.collection('repertoires').get();

    if (args.dryRun) {
        console.log(`Would update ${snapshot.size} repertoires in ${projectId}.`);
        process.exit(0);
    }

    const batches = [];
    let batch = firestore.batch();
    let batchSize = 0;

    for (const document of snapshot.docs) {
        batch.update(document.ref, {
            authorId: args.adminUid,
            ownerId: args.adminUid,
            scope: 'shared',
            published: true,
            lastUpdateDate: FieldValue.serverTimestamp(),
        });
        batchSize += 1;

        if (batchSize === 500) {
            batches.push(batch.commit());
            batch = firestore.batch();
            batchSize = 0;
        }
    }

    if (batchSize > 0) {
        batches.push(batch.commit());
    }

    await Promise.all(batches);
    console.log(`Updated ${snapshot.size} repertoires as shared and owned by ${args.adminUid}.`);
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

function parseArgs(argv) {
    const parsed = {};

    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--dry-run') {
            parsed.dryRun = true;
        } else if (arg === '--admin-uid') {
            parsed.adminUid = argv[++index];
        } else if (arg === '--project') {
            parsed.project = argv[++index];
        } else if (arg === '--credentials') {
            parsed.credentials = argv[++index];
        } else {
            throw new Error(`Unknown argument: ${arg}`);
        }
    }

    return parsed;
}
