import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';
import { PartialSong } from 'app/models/partialsong';
import { Song } from 'app/models/song';
import { DeleteToolComponent } from './tools/delete.component';
import { EditToolComponent } from './tools/edit.component';
import { FullscreenToolComponent } from './tools/fullscreen.component';
import { SettingsToolComponent } from './tools/settings.component';
import { TransposeToolComponent } from './tools/transpose.component';
import { ZoomToolComponent } from './tools/zoom.component';

@Component({
    selector: 'chp-viewer-toolbar',
    templateUrl: './viewer-toolbar.component.html',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        TranslocoModule,
        MatSliderModule,
        EditToolComponent,
        TransposeToolComponent,
        ZoomToolComponent,
        FullscreenToolComponent,
        SettingsToolComponent,
        DeleteToolComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChpViewerToolbarComponent {
    @Input() deviceType = 'phone';
    @Input() song: Song | PartialSong;
    @Input() isFullScreen = false;
    @Input() showEditDelete = true;

    @Output() editSongEvent = new EventEmitter<void>();
    @Output() transposeEvent = new EventEmitter<'up' | 'down'>();
    @Output() zoomEvent = new EventEmitter<number>();
    @Output() fullScreenEvent = new EventEmitter<void>();
    @Output() settingsEvent = new EventEmitter<void>();
    @Output() deleteSongEvent = new EventEmitter<void>();

    onZoomEvent(value: number): void {
        this.zoomEvent.emit(value);
    }
}
