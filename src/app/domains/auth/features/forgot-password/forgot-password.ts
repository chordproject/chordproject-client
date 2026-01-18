import { Component, inject, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  required,
  submit,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'auth-forgot-password',
  templateUrl: './forgot-password.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    FormField,
    MatCard,
  ],
})
export default class AuthForgotPassword {
  // Dependencies
  private router = inject(Router);

  // State
  protected forgotPasswordFormModel = signal({
    email: '',
  });
  protected forgotPasswordForm = form(this.forgotPasswordFormModel, (form) => {
    required(form.email, { message: 'You must enter an email address' });
    email(form.email, { message: 'You must enter a valid email address' });
  });

  forgotPassword(event: Event) {
    event.preventDefault();

    submit(this.forgotPasswordForm, async () => {
      // Navigate to a route, demo purposes only
      this.router.navigateByUrl('/auth/reset-password');
    });
  }
}
