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
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '@/app/core/firebase/auth/auth.service';
import { environment } from 'environments/environment';

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
    TranslocoModule,
  ],
})
export default class AuthForgotPassword {
  protected readonly brand = environment.brand;
  // Dependencies
  protected readonly watermarkTiles = Array.from({ length: 120 });
  private authService = inject(AuthService);

  // State
  protected forgotPasswordFormModel = signal({
    email: '',
  });
  protected forgotPasswordForm = form(this.forgotPasswordFormModel, (form) => {
    required(form.email, { message: 'auth.email_required' });
    email(form.email, { message: 'auth.email_invalid' });
  });

  forgotPassword(event: Event) {
    event.preventDefault();

    submit(this.forgotPasswordForm, async () => {
      const { email } = this.forgotPasswordFormModel();
      this.authService.forgotPassword(email).subscribe();
    });
  }
}
