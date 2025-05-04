import { NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AvailableLangs, TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'languages',
    templateUrl: './languages.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'languages',
    imports: [MatButtonModule, MatMenuModule, NgTemplateOutlet],
})
export class LanguagesComponent implements OnInit, OnDestroy {
    availableLangs: AvailableLangs;
    activeLang: string;
    flagCodes: any;

    constructor(private _translocoService: TranslocoService) {}

    ngOnInit(): void {
        // Get the available languages from transloco
        this.availableLangs = this._translocoService.getAvailableLangs();

        // Subscribe to language changes
        this._translocoService.langChanges$.subscribe((activeLang) => {
            // Get the active lang
            this.activeLang = activeLang;
        });

        // Set the country iso codes for languages for flags
        this.flagCodes = {
            es: 'es',
            fr: 'fr',
            en: 'en',
        };
    }

    ngOnDestroy(): void {}

    setActiveLang(lang: string): void {
        this._translocoService.setActiveLang(lang);
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
