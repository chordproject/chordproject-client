import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';
import { EventType } from 'app/models/event-type';

export type RepertoireCreateDialogData = {
    eventTypes: EventType[];
};

export type RepertoireCreateDialogResult = {
    eventTypeId: string;
    title: string;
    description?: string;
    date: Date;
};

@Component({
    selector: 'chp-repertoire-create-dialog',
    standalone: true,
    templateUrl: './repertoire-create-dialog.component.html',
    imports: [
        MatButton,
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatNativeDateModule,
        MatSelectModule,
        MatTooltipModule,
        ReactiveFormsModule,
        TranslocoModule,
    ],
})
export class RepertoireCreateDialogComponent {
    private dialogRef = inject(MatDialogRef<RepertoireCreateDialogComponent, RepertoireCreateDialogResult | undefined>);
    private formBuilder = inject(FormBuilder);
    protected data = inject<RepertoireCreateDialogData>(MAT_DIALOG_DATA);

    form = this.formBuilder.group({
        eventTypeId: [this.data.eventTypes[0]?.uid ?? '', Validators.required],
        title: ['', [Validators.required, Validators.minLength(2)]],
        description: [''],
        date: [new Date(), Validators.required],
    });

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const value = this.form.getRawValue();
        this.dialogRef.close({
            eventTypeId: value.eventTypeId,
            title: value.title.trim(),
            description: value.description?.trim() || undefined,
            date: value.date,
        });
    }
}
