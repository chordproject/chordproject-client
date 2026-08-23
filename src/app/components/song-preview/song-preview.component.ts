import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';
import { ChpViewerComponent } from 'app/components/viewer/viewer/viewer.component';
import { PartialSong } from 'app/models/partialsong';
import { Song } from 'app/models/song';

@Component({
    selector: 'chp-song-preview',
    standalone: true,
    templateUrl: './song-preview.component.html',
    imports: [MatButtonModule, MatIconModule, MatTooltipModule, TranslocoModule, ChpViewerComponent],
})
export class ChpSongPreviewComponent {
    @Input() song: Song | PartialSong;
    @Input() showQuickEdit = false;
    @Input() showFullEditor = false;
    @Input() showClose = false;

    @Output() quickEdit = new EventEmitter<void>();
    @Output() openFullEditor = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();

    get content(): string {
        return this.song?.content || this.song?.lyrics || '';
    }
}
