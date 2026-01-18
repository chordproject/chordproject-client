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
      // Navigate to a route, demo purposes only
      this.router.navigateByUrl('/auth/sign-in');
    });
  }
}
