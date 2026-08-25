import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@jsverse/transloco';
import { SongbookSuggestionType } from 'app/models/songbook-suggestion';
import { Songbook } from 'app/models/songbook';

export type SongbookSuggestionDialogData = {
    songbook: Songbook;
    hasChildren: boolean;
};

export type SongbookSuggestionDialogResult = {
    type: SongbookSuggestionType;
    suggestedName?: string;
    message: string;
};

@Component({
    selector: 'chp-songbook-suggestion-dialog',
    standalone: true,
    templateUrl: './songbook-suggestion-dialog.component.html',
    imports: [MatButton, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, TranslocoModule],
})
export class SongbookSuggestionDialogComponent {
    private dialogRef = inject(MatDialogRef<SongbookSuggestionDialogComponent, SongbookSuggestionDialogResult | undefined>);
    private formBuilder = inject(FormBuilder);

    data: SongbookSuggestionDialogData = inject(MAT_DIALOG_DATA);
    form = this.formBuilder.group({
        type: this.formBuilder.control<SongbookSuggestionType>('add_song', { nonNullable: true, validators: [Validators.required] }),
        suggestedName: [''],
        message: ['', [Validators.required, Validators.minLength(10)]],
    });

    get selectedType(): SongbookSuggestionType {
        return this.form.controls.type.value;
    }

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const value = this.form.getRawValue();
        this.dialogRef.close({
            type: value.type,
            suggestedName: value.suggestedName?.trim() || undefined,
            message: value.message.trim(),
        });
    }
}
