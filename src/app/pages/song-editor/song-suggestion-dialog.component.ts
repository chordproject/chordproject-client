import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { TranslocoModule } from '@jsverse/transloco';

export type SongSuggestionMode = 'suggestion' | 'version';

export type SongSuggestionDialogResult = {
    message?: string;
    mode: SongSuggestionMode;
};

@Component({
    selector: 'chp-song-suggestion-dialog',
    standalone: true,
    templateUrl: './song-suggestion-dialog.component.html',
    imports: [MatButton, MatDialogModule, MatFormFieldModule, MatInputModule, MatRadioModule, ReactiveFormsModule, TranslocoModule],
})
export class SongSuggestionDialogComponent {
    private dialogRef = inject(MatDialogRef<SongSuggestionDialogComponent, SongSuggestionDialogResult | undefined>);
    private formBuilder = inject(FormBuilder);

    form = this.formBuilder.group({
        mode: ['suggestion' as SongSuggestionMode],
        message: [''],
    });

    submit(): void {
        const value = this.form.getRawValue();
        this.dialogRef.close({
            mode: value.mode,
            message: value.message?.trim() || undefined,
        });
    }
}
