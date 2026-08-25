import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@jsverse/transloco';

export type SongbookCreateDialogResult = {
    name: string;
};

@Component({
    selector: 'chp-songbook-create-dialog',
    standalone: true,
    templateUrl: './songbook-create-dialog.component.html',
    imports: [MatButton, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, TranslocoModule],
})
export class SongbookCreateDialogComponent {
    private dialogRef = inject(MatDialogRef<SongbookCreateDialogComponent, SongbookCreateDialogResult | undefined>);
    private formBuilder = inject(FormBuilder);

    form = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
    });

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.dialogRef.close({ name: this.form.getRawValue().name.trim() });
    }
}
