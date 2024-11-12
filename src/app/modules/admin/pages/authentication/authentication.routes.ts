import { Routes } from '@angular/router';
import { ConfirmationRequiredClassicComponent } from './confirmation-required/classic/confirmation-required.component';
import { ConfirmationRequiredFullscreenReversedComponent } from './confirmation-required/fullscreen-reversed/confirmation-required.component';
import { ConfirmationRequiredFullscreenComponent } from './confirmation-required/fullscreen/confirmation-required.component';
import { ConfirmationRequiredModernReversedComponent } from './confirmation-required/modern-reversed/confirmation-required.component';
import { ConfirmationRequiredModernComponent } from './confirmation-required/modern/confirmation-required.component';
import { ConfirmationRequiredSplitScreenReversedComponent } from './confirmation-required/split-screen-reversed/confirmation-required.component';
import { ConfirmationRequiredSplitScreenComponent } from './confirmation-required/split-screen/confirmation-required.component';
import { ForgotPasswordClassicComponent } from './forgot-password/classic/forgot-password.component';
import { ForgotPasswordFullscreenReversedComponent } from './forgot-password/fullscreen-reversed/forgot-password.component';
import { ForgotPasswordFullscreenComponent } from './forgot-password/fullscreen/forgot-password.component';
import { ForgotPasswordModernReversedComponent } from './forgot-password/modern-reversed/forgot-password.component';
import { ForgotPasswordModernComponent } from './forgot-password/modern/forgot-password.component';
import { ForgotPasswordSplitScreenReversedComponent } from './forgot-password/split-screen-reversed/forgot-password.component';
import { ForgotPasswordSplitScreenComponent } from './forgot-password/split-screen/forgot-password.component';
import { ResetPasswordClassicComponent } from './reset-password/classic/reset-password.component';
import { ResetPasswordFullscreenReversedComponent } from './reset-password/fullscreen-reversed/reset-password.component';
import { ResetPasswordFullscreenComponent } from './reset-password/fullscreen/reset-password.component';
import { ResetPasswordModernReversedComponent } from './reset-password/modern-reversed/reset-password.component';
import { ResetPasswordModernComponent } from './reset-password/modern/reset-password.component';
import { ResetPasswordSplitScreenReversedComponent } from './reset-password/split-screen-reversed/reset-password.component';
import { ResetPasswordSplitScreenComponent } from './reset-password/split-screen/reset-password.component';
import { SignInClassicComponent } from './sign-in/classic/sign-in.component';
import { SignInFullscreenReversedComponent } from './sign-in/fullscreen-reversed/sign-in.component';
import { SignInFullscreenComponent } from './sign-in/fullscreen/sign-in.component';
import { SignInModernReversedComponent } from './sign-in/modern-reversed/sign-in.component';
import { SignInModernComponent } from './sign-in/modern/sign-in.component';
import { SignInSplitScreenReversedComponent } from './sign-in/split-screen-reversed/sign-in.component';
import { SignInSplitScreenComponent } from './sign-in/split-screen/sign-in.component';
import { SignOutClassicComponent } from './sign-out/classic/sign-out.component';
import { SignOutFullscreenReversedComponent } from './sign-out/fullscreen-reversed/sign-out.component';
import { SignOutFullscreenComponent } from './sign-out/fullscreen/sign-out.component';
import { SignOutModernReversedComponent } from './sign-out/modern-reversed/sign-out.component';
import { SignOutModernComponent } from './sign-out/modern/sign-out.component';
import { SignOutSplitScreenReversedComponent } from './sign-out/split-screen-reversed/sign-out.component';
import { SignOutSplitScreenComponent } from './sign-out/split-screen/sign-out.component';
import { SignUpClassicComponent } from './sign-up/classic/sign-up.component';
import { SignUpFullscreenReversedComponent } from './sign-up/fullscreen-reversed/sign-up.component';
import { SignUpFullscreenComponent } from './sign-up/fullscreen/sign-up.component';
import { SignUpModernReversedComponent } from './sign-up/modern-reversed/sign-up.component';
import { SignUpModernComponent } from './sign-up/modern/sign-up.component';
import { SignUpSplitScreenReversedComponent } from './sign-up/split-screen-reversed/sign-up.component';
import { SignUpSplitScreenComponent } from './sign-up/split-screen/sign-up.component';
import { UnlockSessionClassicComponent } from './unlock-session/classic/unlock-session.component';
import { UnlockSessionFullscreenReversedComponent } from './unlock-session/fullscreen-reversed/unlock-session.component';
import { UnlockSessionFullscreenComponent } from './unlock-session/fullscreen/unlock-session.component';
import { UnlockSessionModernReversedComponent } from './unlock-session/modern-reversed/unlock-session.component';
import { UnlockSessionModernComponent } from './unlock-session/modern/unlock-session.component';
import { UnlockSessionSplitScreenReversedComponent } from './unlock-session/split-screen-reversed/unlock-session.component';
import { UnlockSessionSplitScreenComponent } from './unlock-session/split-screen/unlock-session.component';

export default [
    // Sign in
    {
        path: 'sign-in',
        children: [
            {
                path: 'classic',
                component: SignInClassicComponent,
            },
            {
                path: 'modern',
                component: SignInModernComponent,
            },
            {
                path: 'modern-reversed',
                component: SignInModernReversedComponent,
            },
            {
                path: 'split-screen',
                component: SignInSplitScreenComponent,
            },
            {
                path: 'split-screen-reversed',
                component: SignInSplitScreenReversedComponent,
            },
            {
                path: 'fullscreen',
                component: SignInFullscreenComponent,
            },
            {
                path: 'fullscreen-reversed',
                component: SignInFullscreenReversedComponent,
            },
        ],
    },
    // Sign up
    {
        path: 'sign-up',
        children: [
            {
                path: 'classic',
                component: SignUpClassicComponent,
            },
            {
                path: 'modern',
                component: SignUpModernComponent,
            },
            {
                path: 'modern-reversed',
                component: SignUpModernReversedComponent,
            },
            {
                path: 'split-screen',
                component: SignUpSplitScreenComponent,
            },
            {
                path: 'split-screen-reversed',
                component: SignUpSplitScreenReversedComponent,
            },
            {
                path: 'fullscreen',
                component: SignUpFullscreenComponent,
            },
            {
                path: 'fullscreen-reversed',
                component: SignUpFullscreenReversedComponent,
            },
        ],
    },
    // Sign out
    {
        path: 'sign-out',
        children: [
            {
                path: 'classic',
                component: SignOutClassicComponent,
            },
            {
                path: 'modern',
                component: SignOutModernComponent,
            },
            {
                path: 'modern-reversed',
                component: SignOutModernReversedComponent,
            },
            {
                path: 'split-screen',
                component: SignOutSplitScreenComponent,
            },
            {
                path: 'split-screen-reversed',
                component: SignOutSplitScreenReversedComponent,
            },
            {
                path: 'fullscreen',
                component: SignOutFullscreenComponent,
            },
            {
                path: 'fullscreen-reversed',
                component: SignOutFullscreenReversedComponent,
            },
        ],
    },
    // Forgot password
    {
        path: 'forgot-password',
        children: [
            {
                path: 'classic',
                component: ForgotPasswordClassicComponent,
            },
            {
                path: 'modern',
                component: ForgotPasswordModernComponent,
            },
            {
                path: 'modern-reversed',
                component: ForgotPasswordModernReversedComponent,
            },
            {
                path: 'split-screen',
                component: ForgotPasswordSplitScreenComponent,
            },
            {
                path: 'split-screen-reversed',
                component: ForgotPasswordSplitScreenReversedComponent,
            },
            {
                path: 'fullscreen',
                component: ForgotPasswordFullscreenComponent,
            },
            {
                path: 'fullscreen-reversed',
                component: ForgotPasswordFullscreenReversedComponent,
            },
        ],
    },
    // Reset password
    {
        path: 'reset-password',
        children: [
            {
                path: 'classic',
                component: ResetPasswordClassicComponent,
            },
            {
                path: 'modern',
                component: ResetPasswordModernComponent,
            },
            {
                path: 'modern-reversed',
                component: ResetPasswordModernReversedComponent,
            },
            {
                path: 'split-screen',
                component: ResetPasswordSplitScreenComponent,
            },
            {
                path: 'split-screen-reversed',
                component: ResetPasswordSplitScreenReversedComponent,
            },
            {
                path: 'fullscreen',
                component: ResetPasswordFullscreenComponent,
            },
            {
                path: 'fullscreen-reversed',
                component: ResetPasswordFullscreenReversedComponent,
            },
        ],
    },
    // Unlock session
    {
        path: 'unlock-session',
        children: [
            {
                path: 'classic',
                component: UnlockSessionClassicComponent,
            },
            {
                path: 'modern',
                component: UnlockSessionModernComponent,
            },
            {
                path: 'modern-reversed',
                component: UnlockSessionModernReversedComponent,
            },
            {
                path: 'split-screen',
                component: UnlockSessionSplitScreenComponent,
            },
            {
                path: 'split-screen-reversed',
                component: UnlockSessionSplitScreenReversedComponent,
            },
            {
                path: 'fullscreen',
                component: UnlockSessionFullscreenComponent,
            },
            {
                path: 'fullscreen-reversed',
                component: UnlockSessionFullscreenReversedComponent,
            },
        ],
    },
    // Confirmation required
    {
        path: 'confirmation-required',
        children: [
            {
                path: 'classic',
                component: ConfirmationRequiredClassicComponent,
            },
            {
                path: 'modern',
                component: ConfirmationRequiredModernComponent,
            },
            {
                path: 'modern-reversed',
                component: ConfirmationRequiredModernReversedComponent,
            },
            {
                path: 'split-screen',
                component: ConfirmationRequiredSplitScreenComponent,
            },
            {
                path: 'split-screen-reversed',
                component: ConfirmationRequiredSplitScreenReversedComponent,
            },
            {
                path: 'fullscreen',
                component: ConfirmationRequiredFullscreenComponent,
            },
            {
                path: 'fullscreen-reversed',
                component: ConfirmationRequiredFullscreenReversedComponent,
            },
        ],
    },
] as Routes;
