import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { ChpViewerPanelComponent } from 'app/components/viewer/viewer-panel/viewer-panel.component';
import { PartialSong } from 'app/models/partialsong';
import { Song } from 'app/models/song';

@Component({
    selector: 'chp-song-preview',
    standalone: true,
    templateUrl: './song-preview.component.html',
    imports: [MatButtonModule, MatIconModule, MatTooltipModule, RouterLink, TranslocoModule, ChpViewerPanelComponent],
})
export class ChpSongPreviewComponent {
    @Input() song: Song | PartialSong;
    @Input() showFullEditor = false;
    @Input() showClose = false;
    @Input() pendingSuggestion = false;
    @Input() alternateVersions: PartialSong[] = [];
    @Input() alternateVersionRoute: 'reader' | 'editor' = 'reader';

    versionRoute(uid: string): string[] {
        return this.alternateVersionRoute === 'editor' ? ['/songs/create', uid] : ['/songs/read', uid];
    }

    @Output() openFullEditor = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();

    get content(): string {
        return this.song?.content || this.song?.lyrics || '';
    }
}
