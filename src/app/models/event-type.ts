import { BaseDocument } from './base-document';

export class EventType extends BaseDocument {
    name: string;
    description?: string;
}
