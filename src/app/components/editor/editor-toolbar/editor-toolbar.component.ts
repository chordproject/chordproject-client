import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';
import { TransposeToolComponent } from 'app/components/viewer/viewer-toolbar/tools/transpose.component';

@Component({
    selector: 'chp-editor-toolbar',
    templateUrl: './editor-toolbar.component.html',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatTooltipModule, TranslocoModule, TransposeToolComponent],
})
export class ChpEditorToolbarComponent {
    @Input() mode: 'quick' | 'full' = 'full';
    @Input() showDelete = true;
    @Input() songKey: string;

    @Output() saveSongEvent = new EventEmitter<void>();
    @Output() removeSongEvent = new EventEmitter<void>();
    @Output() helpEvent = new EventEmitter<void>();
    @Output() openFullEditorEvent = new EventEmitter<void>();
    @Output() previewEvent = new EventEmitter<void>();
    @Output() transposeEvent = new EventEmitter<'up' | 'down'>();
    @Output() closeEvent = new EventEmitter<void>();
}
