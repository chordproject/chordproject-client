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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@/app/core/firebase/auth/auth.service';
import { environment } from 'environments/environment';

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
  protected readonly brand = environment.brand;
  // Dependencies
  protected readonly watermarkTiles = Array.from({ length: 120 });
  private router = inject(Router);
  private route = inject(ActivatedRoute);
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

  /** Only allow same-app relative paths as a redirect target, to avoid an open redirect. */
  private getReturnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    return returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/home';
  }

  signIn(event: Event) {
    event.preventDefault();

    submit(this.signInForm, async () => {
      const { email, password } = this.signInFormModel();
      try {
        await firstValueFrom(this.authService.signInWithEmail(email, password));
        this.router.navigateByUrl(this.getReturnUrl());
      } catch {
        // Error already surfaced to the user via AuthService's snackbar.
      }
    });
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle().subscribe({
      next: () => this.router.navigateByUrl(this.getReturnUrl()),
    });
  }

  signInWithGithub() {
    this.authService.signInWithGithub().subscribe({
      next: () => this.router.navigateByUrl(this.getReturnUrl()),
    });
  }
}
