export type Tag = {
    id?: string;
    title?: string;
};

export type TagOption = Tag & { isNew?: boolean };
