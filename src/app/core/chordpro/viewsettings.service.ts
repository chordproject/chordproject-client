import { Injectable } from '@angular/core';
import {
    FontColor,
    FontSize,
    FontStyle,
} from 'app/tools/font-customization/font-style';
import { ViewSettings } from 'app/tools/view-customization/view-settings';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ViewSettingsService {
    private viewSettingsSubject: BehaviorSubject<ViewSettings>;
    private _viewSettings: ViewSettings;

    constructor() {
        this.initDefaultSettings();
        this._viewSettings = localStorage.viewSettings
            ? JSON.parse(localStorage.viewSettings)
            : (this._viewSettings = this.getDefaultViewSettings());
        this.viewSettingsSubject = new BehaviorSubject<ViewSettings>(
            this._viewSettings
        );
    }

    private _defaultViewSettings: ViewSettings;
    private initDefaultSettings() {
        this._defaultViewSettings = new ViewSettings();
        const lyricsDefaultStyle = new FontStyle();
        lyricsDefaultStyle.color = FontColor.Default;
        lyricsDefaultStyle.size = FontSize.M;
        lyricsDefaultStyle.isBold = lyricsDefaultStyle.isItalic = false;
        this._defaultViewSettings.lyricsFontStyle = lyricsDefaultStyle;

        const chordsDefaultStyle = new FontStyle();
        chordsDefaultStyle.color = FontColor.Red;
        chordsDefaultStyle.size = FontSize.M;
        chordsDefaultStyle.isBold = true;
        chordsDefaultStyle.isItalic = false;
        this._defaultViewSettings.chordsFontStyle = chordsDefaultStyle;

        const commentsDefaultStyle = new FontStyle();
        commentsDefaultStyle.color = FontColor.Green;
        commentsDefaultStyle.size = FontSize.M;
        commentsDefaultStyle.isBold = false;
        commentsDefaultStyle.isItalic = false;
        this._defaultViewSettings.commentsFontStyle = commentsDefaultStyle;
    }

    public getDefaultViewSettings(): ViewSettings {
        return Object.assign({}, this._defaultViewSettings);
    }

    public getViewSettings(): Observable<ViewSettings> {
        return this.viewSettingsSubject.asObservable();
    }
    public setViewSettings(value: ViewSettings): void {
        this._viewSettings = value;
        localStorage.setItem(
            'viewSettings',
            JSON.stringify(this._viewSettings)
        );
        this.viewSettingsSubject.next(this._viewSettings);
    }
}
