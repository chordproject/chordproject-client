import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@jsverse/transloco';

export type SongbookCreateDialogResult = {
    name: string;
    scope: 'personal' | 'group';
};

export type SongbookCreateDialogData = { canShareWithGroup: boolean };

@Component({
    selector: 'chp-songbook-create-dialog',
    standalone: true,
    templateUrl: './songbook-create-dialog.component.html',
    imports: [MatButton, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, TranslocoModule],
})
export class SongbookCreateDialogComponent {
    private dialogRef = inject(MatDialogRef<SongbookCreateDialogComponent, SongbookCreateDialogResult | undefined>);
    private formBuilder = inject(FormBuilder);
    protected data = inject<SongbookCreateDialogData>(MAT_DIALOG_DATA);

    form = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        scope: ['personal' as 'personal' | 'group', Validators.required],
    });

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const value = this.form.getRawValue();
        this.dialogRef.close({ name: value.name.trim(), scope: value.scope });
    }
}
