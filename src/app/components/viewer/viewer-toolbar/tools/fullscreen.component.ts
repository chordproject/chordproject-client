import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'chp-fullscreen-tool',
    standalone: true,
    templateUrl: './fullscreen.component.html',
    imports: [MatButtonModule, MatIconModule, MatTooltipModule, TranslocoModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullscreenToolComponent {
    @Output() fullScreenEvent = new EventEmitter<void>();
}
