import { FontStyle } from '../font-customization/font-style';

export class ViewSettings {
    showColumns: boolean;
    showTabs: boolean;
    showChords: boolean;
    showDiagrams: boolean;

    lyricsFontStyle: FontStyle;
    chordsFontStyle: FontStyle;
    commentsFontStyle: FontStyle;

    constructor() {
        this.showColumns = false;
        this.showTabs = true;
        this.showChords = true;
        this.showDiagrams = true;
        this.lyricsFontStyle = new FontStyle();
        this.chordsFontStyle = new FontStyle();
        this.commentsFontStyle = new FontStyle();
    }
}
