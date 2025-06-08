import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'chp-zoom-tool',
    standalone: true,
    templateUrl: './zoom.component.html',
    imports: [CommonModule, MatButtonModule, MatIconModule, MatSliderModule, MatTooltipModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoomToolComponent {
    @Input() isMobile = true;
    @Output() zoomEvent = new EventEmitter<number>();
    showSizeSlider = false;
    fontSize = 14;

    toggleSizeSlider(): void {
        this.showSizeSlider = !this.showSizeSlider;
    }

    onZoomEvent(size: number): void {
        this.fontSize = size;
        this.zoomEvent.emit(size);
    }
}
