import { Route } from '@angular/router';
import { initialDataResolver } from './app.resolvers';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { NoAuthGuard } from './core/auth/guards/noAuth.guard';
import { LayoutComponent } from './layout/layout.component';

// prettier-ignore
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboards/project'
    {path: '', pathMatch : 'full', redirectTo: 'dashboards/project'},

    // Redirect signed-in user to the '/dashboards/project'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {
        path: 'signed-in-redirect',
        pathMatch : 'full',
        redirectTo: 'dashboards/project'
    },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('./features/auth/confirmation-required/confirmation-required.routes')},
            {path: 'forgot-password', loadChildren: () => import('./features/auth/forgot-password/forgot-password.routes')},
            {path: 'reset-password', loadChildren: () => import('./features/auth/reset-password/reset-password.routes')},
            {path: 'sign-in', loadChildren: () => import('./features/auth/sign-in/sign-in.routes')},
            {path: 'sign-up', loadChildren: () => import('./features/auth/sign-up/sign-up.routes')}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('./features/auth/sign-out/sign-out.routes')},
            {path: 'unlock-session', loadChildren: () => import('./features/auth/unlock-session/unlock-session.routes')}
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'home', loadChildren: () => import('./features/landing/home/home.routes')},
        ]
    },

    // Documentation routes
    // {
    //     path: '',
    //     component: LayoutComponent,
    //     data: {
    //         layout: 'classic'
    //     },
    //     children: [
    //         {path: 'documentation', loadChildren: () => import('./features/documentation/documentation.routes')},
    //     ]
    // },
    {
        path: 'documentation',
        loadChildren: () => import('./features/documentation/documentation.routes')
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [

            // Dashboards
            {path: 'dashboards', children: [
                {path: 'project', loadChildren: () => import('./features/admin/dashboards/project/project.routes')},
                {path: 'analytics', loadChildren: () => import('./features/admin/dashboards/analytics/analytics.routes')},
                {path: 'finance', loadChildren: () => import('./features/admin/dashboards/finance/finance.routes')},
                {path: 'crypto', loadChildren: () => import('./features/admin/dashboards/crypto/crypto.routes')},
            ]},

            // Apps
            {path: 'apps', children: [
                {path: 'academy', loadChildren: () => import('./features/admin/apps/academy/academy.routes')},
                {path: 'chat', loadChildren: () => import('./features/admin/apps/chat/chat.routes')},
                {path: 'contacts', loadChildren: () => import('./features/admin/apps/contacts/contacts.routes')},
                {path: 'ecommerce', loadChildren: () => import('./features/admin/apps/ecommerce/ecommerce.routes')},
                {path: 'file-manager', loadChildren: () => import('./features/admin/apps/file-manager/file-manager.routes')},
                {path: 'help-center', loadChildren: () => import('./features/admin/apps/help-center/help-center.routes')},
                {path: 'mailbox', loadChildren: () => import('./features/admin/apps/mailbox/mailbox.routes')},
                {path: 'notes', loadChildren: () => import('./features/admin/apps/notes/notes.routes')},
                {path: 'scrumboard', loadChildren: () => import('./features/admin/apps/scrumboard/scrumboard.routes')},
                {path: 'tasks', loadChildren: () => import('./features/admin/apps/tasks/tasks.routes')},
            ]},

            // Pages
            {path: 'pages', children: [

                // Activities
                {path: 'activities', loadChildren: () => import('./features/admin/pages/activities/activities.routes')},

                // Authentication
                {path: 'authentication', loadChildren: () => import('./features/admin/pages/authentication/authentication.routes')},

                // Coming Soon
                {path: 'coming-soon', loadChildren: () => import('./features/admin/pages/coming-soon/coming-soon.routes')},

                // Error
                {path: 'error', children: [
                    {path: '404', loadChildren: () => import('./features/admin/pages/error/error-404/error-404.routes')},
                    {path: '500', loadChildren: () => import('./features/admin/pages/error/error-500/error-500.routes')}
                ]},

                // Invoice
                {path: 'invoice', children: [
                    {path: 'printable', children: [
                        {path: 'compact', loadChildren: () => import('./features/admin/pages/invoice/printable/compact/compact.routes')},
                        {path: 'modern', loadChildren: () => import('./features/admin/pages/invoice/printable/modern/modern.routes')}
                    ]}
                ]},

                // Maintenance
                {path: 'maintenance', loadChildren: () => import('./features/admin/pages/maintenance/maintenance.routes')},

                // Pricing
                {path: 'pricing', children: [
                    {path: 'modern', loadChildren: () => import('./features/admin/pages/pricing/modern/modern.routes')},
                    {path: 'simple', loadChildren: () => import('./features/admin/pages/pricing/simple/simple.routes')},
                    {path: 'single', loadChildren: () => import('./features/admin/pages/pricing/single/single.routes')},
                    {path: 'table', loadChildren: () => import('./features/admin/pages/pricing/table/table.routes')}
                ]},

                // Profile
                {path: 'profile', loadChildren: () => import('./features/admin/pages/profile/profile.routes')},

                // Settings
                {path: 'settings', loadChildren: () => import('./features/admin/pages/settings/settings.routes')},
            ]},

            // 404 & Catch all
            {path: '404-not-found', pathMatch: 'full', loadChildren: () => import('./features/admin/pages/error/error-404/error-404.routes')},
            {path: '**', redirectTo: '404-not-found'}
        ]
    }
];
