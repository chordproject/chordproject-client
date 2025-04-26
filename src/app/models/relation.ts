export class Relation {
    constructor(
        public songbookId: string,
        public songId: string
    ) {}
    author_uid: string;
    order?: number;
}
