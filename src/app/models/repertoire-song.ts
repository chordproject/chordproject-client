import { BaseDocument } from './base-document';

export class RepertoireSong extends BaseDocument {
    repertoireId: string;
    songId: string;
    slotId?: string;
    order: number;
    notes?: string;
    status?: 'assigned' | 'skipped';
    songOrder?: number;
}
