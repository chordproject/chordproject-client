import { DOCUMENT } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'fuse-fullscreen',
    templateUrl: './fullscreen.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'fuseFullscreen',
    imports: [MatButtonModule, MatTooltipModule, MatIconModule],
})
export class FuseFullscreenComponent implements OnInit, OnDestroy {
    isFullscreen = false;
    private _document = inject(DOCUMENT);
    private _cdr = inject(ChangeDetectorRef);
    private _fullscreenChangeHandler = () => {
        this.isFullscreen = !!document.fullscreenElement;
        this._cdr.markForCheck();
    };

    @Input() iconTpl: TemplateRef<any>;
    @Input() tooltip: string;

    ngOnInit() {
        document.addEventListener(
            'fullscreenchange',
            this._fullscreenChangeHandler
        );
        this.isFullscreen = !!document.fullscreenElement;
    }

    ngOnDestroy() {
        document.removeEventListener(
            'fullscreenchange',
            this._fullscreenChangeHandler
        );
    }

    toggleFullscreen(): void {
        if (!document.fullscreenEnabled) return;

        // Check if the fullscreen is already open
        const fullScreen = this._document.fullscreenElement;

        // Toggle the fullscreen
        if (fullScreen) {
            this._document.exitFullscreen();
        } else {
            this._document.documentElement.requestFullscreen().catch(() => {
                console.error('Entering fullscreen mode failed.');
            });
        }
    }
}
