import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'chp-settings-tool',
    standalone: true,
    templateUrl: './settings.component.html',
    imports: [MatButtonModule, MatIconModule, MatTooltipModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsToolComponent {
    @Output() openSettingsEvent = new EventEmitter<void>();
}
