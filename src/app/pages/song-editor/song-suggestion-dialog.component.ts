import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@jsverse/transloco';

export type SongSuggestionDialogResult = {
    message?: string;
};

@Component({
    selector: 'chp-song-suggestion-dialog',
    standalone: true,
    templateUrl: './song-suggestion-dialog.component.html',
    imports: [MatButton, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, TranslocoModule],
})
export class SongSuggestionDialogComponent {
    private dialogRef = inject(MatDialogRef<SongSuggestionDialogComponent, SongSuggestionDialogResult | undefined>);
    private formBuilder = inject(FormBuilder);

    form = this.formBuilder.group({
        message: [''],
    });

    submit(): void {
        this.dialogRef.close({ message: this.form.getRawValue().message?.trim() || undefined });
    }
}
