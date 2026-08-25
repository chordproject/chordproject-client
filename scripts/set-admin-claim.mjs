#!/usr/bin/env node

import { applicationDefault, cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const DEFAULT_PROJECT_ID = 'homenajesus-app';

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.uid) {
    printHelp();
    process.exit(args.help ? 0 : 1);
}

const projectId = args.project || process.env.FIREBASE_PROJECT_ID || DEFAULT_PROJECT_ID;

try {
    initializeApp({
        credential: await getCredential(args.credentials),
        projectId,
    });

    const auth = getAuth();
    const user = await auth.getUser(args.uid);
    const claims = { ...user.customClaims };

    if (args.revoke) {
        delete claims.admin;
    } else {
        claims.admin = true;
    }

    await auth.setCustomUserClaims(args.uid, claims);

    console.log(`${args.revoke ? 'Revoked' : 'Granted'} admin claim for ${args.uid} (${user.email || 'no email'}).`);
    console.log('The user must sign out and back in (or refresh their ID token) for the change to take effect.');
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
    const parsedArgs = {};

    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];

        if (arg === '--help' || arg === '-h') {
            parsedArgs.help = true;
        } else if (arg === '--revoke') {
            parsedArgs.revoke = true;
        } else if (arg === '--uid') {
            parsedArgs.uid = argv[++index];
        } else if (arg === '--project') {
            parsedArgs.project = argv[++index];
        } else if (arg === '--credentials') {
            parsedArgs.credentials = argv[++index];
        } else {
            throw new Error(`Unknown argument: ${arg}`);
        }
    }

    return parsedArgs;
}

function printHelp() {
    console.log(`Usage: node scripts/set-admin-claim.mjs --uid <firebaseUid> [options]

Options:
  --uid <uid>            Firebase Auth user id to grant/revoke the admin claim for (required)
  --revoke                Remove the admin claim instead of granting it
  --project <projectId>   Firebase project id (default: ${DEFAULT_PROJECT_ID})
  --credentials <path>    Path to a service account JSON key (default: GOOGLE_APPLICATION_CREDENTIALS env var or ADC)
  --help, -h              Show this help message
`);
}
