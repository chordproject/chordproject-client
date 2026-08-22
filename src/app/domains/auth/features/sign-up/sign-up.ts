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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@/app/core/firebase/auth/auth.service';

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
  ],
})
export default class AuthSignUp {
  // Dependencies
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
    required(form.name, { message: 'You must enter your name' });
    required(form.email, { message: 'You must enter an email address' });
    email(form.email, { message: 'You must enter a valid email address' });
    required(form.password, { message: 'You must enter a password' });
    required(form.company, { message: 'You must enter your company name' });
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
}
