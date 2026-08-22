import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'chp-transpose-tool',
    standalone: true,
    templateUrl: './transpose.component.html',
    imports: [MatButtonModule, MatIconModule, MatTooltipModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransposeToolComponent {
    @Input() isMobile = true;
    @Output() transposeEvent = new EventEmitter<string>();

    private readonly pitchClassMap: Record<string, number> = {
        C: 0,
        'C#': 1,
        D: 2,
        Eb: 3,
        E: 4,
        F: 5,
        'F#': 6,
        G: 7,
        Ab: 8,
        A: 9,
        Bb: 10,
        B: 11,
        Cb: 11,
        'D#': 3,
        'E#': 5,
        Fb: 4,
        'G#': 8,
        'A#': 10,
        'B#': 0,
        Gb: 6,
        Db: 1,
    };
    private readonly reversePitchClassMap: Record<number, string> = {
        0: 'C',
        1: 'C#',
        2: 'D',
        3: 'Eb',
        4: 'E',
        5: 'F',
        6: 'F#',
        7: 'G',
        8: 'Ab',
        9: 'A',
        10: 'Bb',
        11: 'B',
    };

    private _isMinorKey: boolean;

    private _initialKey: string;
    currentKey: string;

    @Input()
    set initialKey(value: string) {
        if (!value) return;
        const baseKey = value.replace('m', '');
        this._isMinorKey = value.includes('m');
        this._initialKey = this.normalizeKey(baseKey);
        this.currentKey = this._initialKey;
        this._updateKeyDisplayAndEmit(); // Emitir evento al inicializar
    }
    get initialKey(): string {
        return this._initialKey;
    }

    private normalizeKey(key: string): string {
        const baseKey = key.replace('m', '');
        if (this.pitchClassMap[baseKey] !== undefined) {
            return key.includes('m') ? `${baseKey}m` : baseKey;
        }
        return key;
    }

    transposeUp(): void {
        this.currentKey = this.transposeKey(this.currentKey, 1);
        this.transposeEvent.emit(this.currentKey);
    }

    transposeDown(): void {
        this.currentKey = this.transposeKey(this.currentKey, -1);
        this.transposeEvent.emit(this.currentKey);
    }

    private transposeKey(key: string, steps: number): string {
        const baseKey = key.replace('m', '');
        const pitchClass = this.pitchClassMap[baseKey];
        const newPitchClass = (pitchClass + steps + 12) % 12;
        const newKey = this.reversePitchClassMap[newPitchClass];

        return this._isMinorKey ? `${newKey}m` : newKey;
    }

    private _updateKeyDisplayAndEmit(): void {
        const displayKey = this._isMinorKey ? `${this.currentKey}m` : this.currentKey;
        this.transposeEvent.emit(displayKey);
    }
}
