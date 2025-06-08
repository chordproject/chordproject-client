import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Song } from 'app/models/song';
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
        MatSliderModule,
        EditToolComponent,
        TransposeToolComponent,
        ZoomToolComponent,
        FullscreenToolComponent,
        SettingsToolComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChpViewerToolbarComponent {
    @Input() deviceType: string = 'phone';
    @Input() song: Song;

    @Output() editSongEvent = new EventEmitter<void>();
    @Output() transposeEvent = new EventEmitter<string>();
    @Output() zoomEvent = new EventEmitter<number>();
    @Output() fullScreenEvent = new EventEmitter<void>();
    @Output() settingsEvent = new EventEmitter<void>();
}
