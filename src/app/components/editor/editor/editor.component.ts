/* eslint-disable @typescript-eslint/no-explicit-any */
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    PLATFORM_ID,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { FuseConfigService } from '@fuse/services/config';
import * as ChordProjectEditor from 'chordproject-editor';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'chp-editor',
    templateUrl: './editor.component.html',
})
export class ChpEditorComponent
    implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
    @Output() contentChange = new EventEmitter<string>();
    @Input() style: any = {};

    @ViewChild('editorDiv', { static: false }) editorDiv!: ElementRef;

    _autoUpdateContent = true;
    _editor: any;
    _durationBeforeCallback = 0;
    _content = '';
    oldContent: any;
    timeoutSaving: any;
    isDarkMode: boolean = false;
    private _initialized = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _fuseConfigService: FuseConfigService,
        @Inject(DOCUMENT) private _document: Document,
        @Inject(PLATFORM_ID) private _platformId: Object
    ) {
        // Check initial dark mode state immediately
        if (isPlatformBrowser(this._platformId)) {
            this.isDarkMode = this._document.body.classList.contains('dark');
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
                if (this.isDarkMode !== newDarkTheme) {
                    this.isDarkMode = newDarkTheme;
                    this.themeChanged();
                }
            });
    }

    ngAfterViewInit(): void {
        // Solo inicializa una vez
        if (!this._initialized) {
            this.initEditor();
            this._initialized = true;
            // Si ya tienes contenido pendiente, lo aplicas aquí
            if (this._content) {
                this.setContent(this._content);
            }
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['content'] && !changes['content'].firstChange) {
            // Actualiza el valor interno del editor aquí
            this.setEditorContent(changes['content'].currentValue);
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    initEditor(): void {
        // Usa el elemento real del DOM
        ChordProjectEditor.Main.init(this.editorDiv.nativeElement);
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
        this._content = content ?? '';
        // Si el editor ya está inicializado, actualiza el contenido
        if (this._editor) {
            this.setContent(this._content);
        }
        // Si no, el contenido se aplicará en ngAfterViewInit
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

    setEditorContent(value: string) {
        // Lógica para actualizar el contenido del editor visualmente
        if (this._editor) {
            this._editor.setValue(value);
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
        if (this.isDarkMode) {
            theme = 'dark';
        }

        ChordProjectEditor.Main.doSetTheme(theme);
    }
}
