/* eslint-disable @typescript-eslint/no-explicit-any */
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    PLATFORM_ID,
} from '@angular/core';
import { FuseConfigService } from '@fuse/services/config';
import * as ChordProjectEditor from 'chordproject-editor';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'chp-editor',
    templateUrl: './editor.component.html',
})
export class EditorComponent implements OnInit, OnDestroy {
    @Output() contentChange = new EventEmitter<string>();
    @Input() style: any = {};

    _autoUpdateContent = true;
    _editor: any;
    _durationBeforeCallback = 0;
    _content = '';
    oldContent: any;
    timeoutSaving: any;
    darkTheme: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _fuseConfigService: FuseConfigService,
        @Inject(DOCUMENT) private _document: Document,
        @Inject(PLATFORM_ID) private _platformId: Object
    ) {
        // Check initial dark mode state immediately
        if (isPlatformBrowser(this._platformId)) {
            this.darkTheme = this._document.body.classList.contains('dark');
        }
    }

    ngOnInit(): void {
        // Subscribe to config changes to detect theme changes
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                // Update darkTheme based on the current scheme and body class
                let newDarkTheme = config.scheme === 'dark';

                // For auto scheme, check the actual body class
                if (
                    config.scheme === 'auto' &&
                    isPlatformBrowser(this._platformId)
                ) {
                    newDarkTheme =
                        this._document.body.classList.contains('dark');
                }

                // Only call themeChanged if the theme actually changed
                if (this.darkTheme !== newDarkTheme) {
                    this.darkTheme = newDarkTheme;
                    this.themeChanged();
                }
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    initEditor(): void {
        ChordProjectEditor.Main.init();
        this._editor = ChordProjectEditor.Main.getEditor();
        this._editor.on('change', () => this.updateContent());
        this._editor.on('paste', () => this.updateContent());

        // Apply current theme when editor is initialized
        this.themeChanged();
    }

    updateContent(): void {
        const newVal = this._editor.getValue();
        if (newVal === this.oldContent) {
            return;
        }
        if (!this._durationBeforeCallback) {
            this._content = newVal;
            this.contentChange.emit(newVal);
        } else {
            if (this.timeoutSaving) {
                clearTimeout(this.timeoutSaving);
            }

            this.timeoutSaving = setTimeout(() => {
                this._content = newVal;
                this.contentChange.emit(newVal);
                this.timeoutSaving = null;
            }, this._durationBeforeCallback);
        }
        this.oldContent = newVal;
    }

    get content(): string {
        return this._content;
    }

    @Input()
    set content(content: string) {
        if (!this._editor) {
            this.initEditor();
        }

        this.setContent(content);
    }

    setContent(content: string): void {
        if (content === null || content === undefined) {
            content = '';
        }
        if (
            this._editor &&
            this._content !== content &&
            this._autoUpdateContent === true
        ) {
            this._content = content;
            this._editor.setValue(content);
            this._editor.clearSelection();
            this._editor.resize(true);
        }
    }

    @Input()
    set autoUpdateContent(status: boolean) {
        this.setAutoUpdateContent(status);
    }

    setAutoUpdateContent(status: boolean): void {
        this._autoUpdateContent = status;
    }

    @Input()
    set durationBeforeCallback(num: number) {
        this.setDurationBeforeCallback(num);
    }

    setDurationBeforeCallback(num: number): void {
        this._durationBeforeCallback = num;
    }

    getEditor(): any {
        return this._editor;
    }

    themeChanged(): void {
        if (!this._editor) {
            return; // Skip if editor is not initialized yet
        }

        let theme = 'default';
        if (this.darkTheme) {
            theme = 'dark';
        }

        ChordProjectEditor.Main.doSetTheme(theme);
    }
}
