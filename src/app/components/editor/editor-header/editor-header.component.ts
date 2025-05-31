import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'chp-editor-header',
    templateUrl: './editor-header.component.html',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatTooltipModule, MatDividerModule],
})
export class ChpEditorHeaderComponent {
    @Input() mode: 'basic' | 'full' = 'full';

    @Output() saveSongEvent = new EventEmitter<void>();
    @Output() removeSongEvent = new EventEmitter<void>();
    @Output() helpEvent = new EventEmitter<void>();
    @Output() openFullEditorEvent = new EventEmitter<void>();
    @Output() closeEvent = new EventEmitter<void>();
}
