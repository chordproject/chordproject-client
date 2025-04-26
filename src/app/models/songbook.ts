import { BaseDocument } from './base-document';

export class Songbook extends BaseDocument {
    name: string;
    order: string;
    parent: string;
    badgeText: string;
    isReorderable: boolean;
}
