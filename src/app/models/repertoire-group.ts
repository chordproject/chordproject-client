import { BaseDocument } from './base-document';
import { Repertoire } from './repertoire';

export class RepertoireGroup extends BaseDocument {
    name: string;
    order?: number;
}

export type RepertoireGroupWithChildren = {
    group: RepertoireGroup;
    repertoires: Repertoire[];
};
