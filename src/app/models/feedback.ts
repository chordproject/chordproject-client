import { BaseDocument } from './base-document';

export type FeedbackType = 'bug' | 'idea';
export type FeedbackStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export class Feedback extends BaseDocument {
    type: FeedbackType;
    status: FeedbackStatus;
    title: string;
    message: string;
    pageUrl?: string;
    allowContact?: boolean;
    contactEmail?: string;
    responseMessage?: string;
    authorName?: string;
}
