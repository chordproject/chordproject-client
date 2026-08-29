import { Component, EventEmitter, inject, Output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';
import { UserService } from 'app/core/user/user.service';
import { FeedbackType } from 'app/models/feedback';

export type FeedbackDialogResult = {
    type: FeedbackType;
    title: string;
    message: string;
    allowContact?: boolean;
    contactEmail?: string;
};

@Component({
    selector: 'admin-feedback-dialog',
    standalone: true,
    templateUrl: './feedback-dialog.html',
    imports: [MatButton, MatFormFieldModule, MatIconModule, MatInputModule, MatRadioModule, MatTooltipModule, ReactiveFormsModule, TranslocoModule],
})
export class FeedbackDialog {
    private formBuilder = inject(FormBuilder);
    private userService = inject(UserService);

    protected isAuthenticated = toSignal(this.userService.isAuthenticated(), { initialValue: false });

    @Output() submitted = new EventEmitter<FeedbackDialogResult>();
    @Output() cancelled = new EventEmitter<void>();

    form = this.formBuilder.group({
        type: this.formBuilder.control<FeedbackType>('bug', { nonNullable: true, validators: [Validators.required] }),
        title: this.formBuilder.control('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(120)] }),
        message: this.formBuilder.control('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
        allowContact: this.formBuilder.control<'yes' | 'no' | null>(null, { validators: [Validators.required] }),
        email: this.formBuilder.control('', { nonNullable: true }),
    });

    submit(): void {
        this.updateEmailValidators();
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const value = this.form.getRawValue();
        const allowContact = value.allowContact === 'yes';
        const shouldIncludeEmail = allowContact && !this.isAuthenticated();
        this.submitted.emit({
            type: value.type,
            title: value.title.trim(),
            message: value.message.trim(),
            allowContact,
            contactEmail: shouldIncludeEmail ? value.email.trim() : undefined,
        });
    }

    private updateEmailValidators(): void {
        const emailCtrl = this.form.controls.email;
        if (this.form.controls.allowContact.value === 'yes' && !this.isAuthenticated()) {
            emailCtrl.setValidators([Validators.required, Validators.email]);
        } else {
            emailCtrl.clearValidators();
        }
        emailCtrl.updateValueAndValidity({ emitEvent: false });
    }
}
