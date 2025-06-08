import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'chp-editor-toolbar',
    templateUrl: './editor-toolbar.component.html',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatTooltipModule],
})
export class ChpEditorToolbarComponent {
    @Input() mode: 'basic' | 'full' = 'full';

    @Output() saveSongEvent = new EventEmitter<void>();
    @Output() removeSongEvent = new EventEmitter<void>();
    @Output() helpEvent = new EventEmitter<void>();
    @Output() openFullEditorEvent = new EventEmitter<void>();
    @Output() closeEvent = new EventEmitter<void>();
}
