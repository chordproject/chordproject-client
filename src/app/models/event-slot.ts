import { BaseDocument } from './base-document';

export class EventSlot extends BaseDocument {
    eventTypeId: string;
    name: string;
    description?: string;
    order: number;
    required: boolean;
    conditions?: Record<string, unknown>;
}
