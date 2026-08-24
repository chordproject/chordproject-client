import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'chp-delete-tool',
    standalone: true,
    templateUrl: './delete.component.html',
    imports: [MatButtonModule, MatIconModule, MatTooltipModule, TranslocoModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteToolComponent {
    @Output() deleteSongEvent = new EventEmitter<void>();
}
