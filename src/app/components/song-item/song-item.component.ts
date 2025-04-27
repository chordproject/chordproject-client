import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PartialSong } from 'app/models/partialsong';

@Component({
    selector: 'chp-song-item',
    templateUrl: 'song-item.component.html',
    standalone: true,
    imports: [CommonModule],
})
export class SongItemComponent {
    @Input() song: PartialSong;
    @Input() ngClass: any;
}
