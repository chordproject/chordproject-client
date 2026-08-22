import { BaseDocument } from './base-document';

export class Song extends BaseDocument {
    albums?: string[];
    arrangers?: string[];
    artists?: string[];
    capo?: number;
    composers?: string[];
    content: string;
    copyright?: string;
    defaultKeyUniqueChords: string[];
    duration?: number;
    hasInferredKey: boolean;
    lyricists?: string[];
    lyrics?: string;
    songKey: string;
    subtitle?: string;
    tempo?: number;
    time?: string;
    title?: string;
    uniqueChords: string[];
    year?: number;
    liked?: boolean;
    videoId?: string;
}
