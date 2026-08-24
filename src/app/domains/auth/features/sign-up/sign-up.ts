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
import { environment } from 'environments/environment';

@Component({
  selector: 'auth-sign-up',
  templateUrl: './sign-up.html',
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
export default class AuthSignUp {
  protected readonly brand = environment.brand;
  // Dependencies
  protected readonly watermarkTiles = Array.from({ length: 120 });
  private router = inject(Router);
  private authService = inject(AuthService);

  // State
  protected signUpFormModel = signal({
    name: '',
    email: '',
    password: '',
    company: '',
  });
  protected signUpForm = form(this.signUpFormModel, (form) => {
    required(form.name, { message: 'auth.name_required' });
    required(form.email, { message: 'auth.email_required' });
    email(form.email, { message: 'auth.email_invalid' });
    required(form.password, { message: 'auth.password_required' });
    required(form.company, { message: 'auth.company_required' });
  });

  signUp(event: Event) {
    event.preventDefault();

    submit(this.signUpForm, async () => {
      const { email, password } = this.signUpFormModel();
      try {
        await firstValueFrom(this.authService.createUser(email, password));
        this.router.navigateByUrl('/auth/sign-in');
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
