import { BaseDocument } from './base-document';

export class Repertoire extends BaseDocument {
    eventTypeId: string;
    title: string;
    description?: string;
    date: Date;
    additionalDates?: unknown[];
}
