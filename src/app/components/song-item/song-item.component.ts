import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PartialSong } from 'app/models/partialsong';

@Component({
    selector: 'chp-song-item',
    templateUrl: 'song-item.component.html',
    standalone: true,
    imports: [CommonModule, MatIconModule, DragDropModule],
})
export class ChpSongItemComponent implements OnDestroy {
    @Input() song: PartialSong;
    @Input() ngClass: any;
    @Input() selected: boolean;
    @Input() showDragHandle = false;

    ngOnDestroy() {
        // Cleanup logic if needed
    }
}
