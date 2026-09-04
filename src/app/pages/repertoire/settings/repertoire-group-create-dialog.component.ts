import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'chp-repertoire-group-create-dialog',
    standalone: true,
    templateUrl: './repertoire-group-create-dialog.component.html',
    imports: [MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, TranslocoModule],
})
export class RepertoireGroupCreateDialogComponent {
    private readonly dialogRef = inject(MatDialogRef<RepertoireGroupCreateDialogComponent, string | undefined>);
    private readonly formBuilder = inject(FormBuilder);

    form = this.formBuilder.nonNullable.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
    });

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.dialogRef.close(this.form.controls.name.value.trim());
    }
}
