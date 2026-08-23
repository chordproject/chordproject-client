import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Song } from 'chordproject-parser';
import { ParserService } from 'app/core/chordpro/parser.service';
import { ViewSettingsService } from 'app/core/chordpro/viewsettings.service';
import { SafeHtmlPipe } from 'app/pipes/safeHtml.pipe';
import { ViewSettings } from 'app/tools/view-customization/view-settings';

@Component({
    selector: 'chp-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss'],
    standalone: true,
    imports: [CommonModule, SafeHtmlPipe],
})
export class ChpViewerComponent implements AfterViewInit {
    @ViewChild('viewerContent') contentElementRef: ElementRef;

    @Input() isPreview = false;
    @Input() compactPreview = false;
    private _showMetadata = true;
    @Input()
    set showMetadata(value: boolean) {
        this._showMetadata = value !== false;
        this.formatSong();
    }
    get showMetadata(): boolean {
        return this._showMetadata;
    }
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
    fontSize = 100;
    isFullScreen = false;
    private transposeSteps = 0;
    isLoading = true;
    contentElement: HTMLElement;
    viewSettings: ViewSettings;

    constructor(
        private parserService: ParserService,
        private viewSettingsService: ViewSettingsService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.viewSettingsService.getViewSettings().subscribe((settings) => this.setViewSettings(settings));
    }

    ngAfterViewInit(): void {
        this.contentElement = this.contentElementRef.nativeElement;
    }

    @HostListener('document:fullscreenchange')
    @HostListener('document:webkitfullscreenchange')
    onFullscreenChange(): void {
        this.isFullScreen = document.fullscreenElement === this.contentElementRef?.nativeElement;
    }

    async toggleFullScreen(): Promise<void> {
        if (document.fullscreenElement) {
            await document.exitFullscreen();
            return;
        }

        const element = this.contentElementRef?.nativeElement;
        if (!element) {
            return;
        }

        await element.requestFullscreen();
    }

    private parseSong() {
        if (this._content) {
            this._initialSong = this.parserService.parseSong(this._content);
            this.transposeSteps = 0;
            this.currentSong = this._initialSong;
        } else {
            this.songHtml = '';
        }
    }

    private setSongHtml(value: string): void {
        this.songHtml = value;
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
    }

    private formatSong() {
        if (!this.currentSong || !this.viewSettings) {
            return;
        }

        const songHtml = this.parserService.formatToHtml(
            this._currentSong,
            this.showMetadata,
            this.isPreview ? true : this.viewSettings.showChords,
            this.isPreview ? true : this.viewSettings.showTabs
        );
        this.setSongHtml(songHtml);
    }

    zoom(value: number): void {
        this.fontSize = value;
        this.changeDetectorRef.markForCheck();
    }

    transpose(direction: 'up' | 'down'): void {
        if (!this.currentSong) {
            return;
        }
        this.transposeSteps += direction === 'up' ? 1 : -1;
        let transposedSong = this._initialSong;
        const stepDirection = this.transposeSteps >= 0 ? 'up' : 'down';
        for (let step = 0; step < Math.abs(this.transposeSteps); step++) {
            transposedSong = this.parserService.transposeSong(transposedSong, stepDirection);
        }
        this.currentSong = transposedSong;
    }

    private setViewSettings(settings: ViewSettings): void {
        const oldSettings = this.viewSettings != undefined ? Object.assign({}, this.viewSettings) : undefined;
        const newSettings = Object.assign({}, settings);
        this.viewSettings = newSettings;
        if (!oldSettings) {
            return;
        }

        if (oldSettings.showChords != newSettings.showChords || oldSettings.showTabs != newSettings.showTabs) {
            this.formatSong();
        }
    }
}
