import { Component, inject, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  required,
  submit,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@/app/core/firebase/auth/auth.service';

@Component({
  selector: 'auth-sign-in',
  templateUrl: './sign-in.html',
  imports: [
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    FormField,
    MatDivider,
    TranslocoModule,
  ],
})
export default class AuthSignIn {
  // Dependencies
  private router = inject(Router);
  private authService = inject(AuthService);

  // State
  protected signInFormModel = signal({
    email: '',
    password: '',
  });
  protected signInForm = form(this.signInFormModel, (form) => {
    required(form.email, { message: 'auth.email_required' });
    email(form.email, { message: 'auth.email_invalid' });

    required(form.password, { message: 'auth.password_required' });
  });

  signIn(event: Event) {
    event.preventDefault();

    submit(this.signInForm, async () => {
      const { email, password } = this.signInFormModel();
      try {
        await firstValueFrom(this.authService.signInWithEmail(email, password));
        this.router.navigateByUrl('/home');
      } catch {
        // Error already surfaced to the user via AuthService's snackbar.
      }
    });
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle().subscribe({
      next: () => this.router.navigateByUrl('/home'),
    });
  }
}
