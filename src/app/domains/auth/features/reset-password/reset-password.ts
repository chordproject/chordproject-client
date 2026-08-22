import { Component, inject, signal } from '@angular/core';
import {
  form,
  FormField,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'auth-reset-password',
  templateUrl: './reset-password.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    FormField,
    MatCard,
    TranslocoModule,
  ],
})
export default class AuthResetPassword {
  // Dependencies
  private router = inject(Router);

  // State
  protected resetPasswordFormModel = signal({
    password: '',
    passwordValidation: '',
  });
  protected resetPasswordForm = form(this.resetPasswordFormModel, (form) => {
    required(form.password, { message: 'auth.password_required' });
    required(form.passwordValidation, {
      message: 'auth.password_required',
    });
    validate(form.passwordValidation, (ctx) => {
      const password = ctx.valueOf(form.password);
      const passwordValidation = ctx.value();

      if (!password || !passwordValidation) return null;

      if (password !== passwordValidation) {
        return {
          kind: 'mismatch',
          message: 'auth.passwords_mismatch',
        };
      }

      return null;
    });
  });

  resetPassword(event: Event) {
    event.preventDefault();

    submit(this.resetPasswordForm, async () => {
      // Navigate to a route, demo purposes only
      this.router.navigateByUrl('/auth/sign-in');
    });
  }
}
