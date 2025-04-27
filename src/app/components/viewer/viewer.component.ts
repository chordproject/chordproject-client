import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    ViewChild,
} from '@angular/core';
import { ParserService } from 'app/core/chordpro/parser.service';
import { ViewSettingsService } from 'app/core/chordpro/viewsettings.service';
import { SafeHtmlPipe } from 'app/pipes/safeHtml.pipe';
import { ViewSettings } from 'app/tools/view-customization/view-settings';
import { Song } from 'chordproject-parser';

@Component({
    selector: 'chp-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss'],
    imports: [CommonModule, SafeHtmlPipe],
})
export class ViewerComponent implements AfterViewInit {
    @ViewChild('viewerContent') contentElementRef: ElementRef;

    @Input() isPreview = false;
    @Input()
    set content(value: string) {
        this._content = value;
        this.parseSong();
    }
    get content(): string {
        return this._content;
    }

    private _content: string;
    private _initialSong: Song;
    private _currentSong: Song;
    private get currentSong(): Song {
        return this._currentSong;
    }
    private set currentSong(song: Song) {
        this._currentSong = song;
        this.formatSong();
    }

    splitAreasSize = {
        song: 80,
        chords: 20,
    };
    songHtml: string;
    fontSize: number;
    isLoading = true;
    contentElement: HTMLElement;
    viewSettings: ViewSettings;

    constructor(
        private parserService: ParserService,
        private viewSettingsService: ViewSettingsService
    ) {
        this.viewSettingsService
            .getViewSettings()
            .subscribe((settings) => this.setViewSettings(settings));
    }

    ngAfterViewInit(): void {
        this.contentElement = this.contentElementRef.nativeElement;
    }

    private parseSong() {
        if (this._content) {
            this._initialSong = this.parserService.parseSong(this._content);
            this.currentSong = this._initialSong;
        } else {
            this.songHtml = '';
        }
    }

    private setSongHtml(value: string): void {
        this.songHtml = value;
        this.isLoading = false;
    }

    private formatSong() {
        if (!this.currentSong || !this.viewSettings) {
            return;
        }

        const songHtml = this.parserService.formatToHtml(
            this._currentSong,
            this.isPreview,
            this.isPreview ? true : this.viewSettings.showChords,
            this.isPreview ? true : this.viewSettings.showTabs
        );
        this.setSongHtml(songHtml);
    }

    zoom(value: number): void {
        this.fontSize = value;
    }

    transpose(letter: string): void {
        if (!this.currentSong) {
            return;
        }
        this.currentSong = this.parserService.transposeSong(
            this._initialSong,
            letter
        );
    }

    private setViewSettings(settings: ViewSettings): void {
        const oldSettings =
            this.viewSettings != undefined
                ? Object.assign({}, this.viewSettings)
                : undefined;
        const newSettings = Object.assign({}, settings);
        this.viewSettings = newSettings;
        if (!oldSettings) {
            return;
        }

        if (
            oldSettings.showChords != newSettings.showChords ||
            oldSettings.showTabs != newSettings.showTabs
        ) {
            this.formatSong();
        }
    }
}
