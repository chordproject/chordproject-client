import { IsActiveMatchOptions } from '@angular/router';

export type NavigationItem = {
  id: string;
  label: string;
  description?: string;
  route?: string;
  icon?: string;
  badge?: string;
  children?: NavigationItem[];
  disabled?: boolean;
  expanded?: boolean;
  activeOptions?: { exact: boolean } | IsActiveMatchOptions;
};

export const NAVIGATION: NavigationItem[] = [
  {
    id: 'general',
    label: 'General',
    description: 'Your application pages',
    children: [
      {
        id: 'general/example',
        label: 'Example',
        icon: 'layout-dashboard',
        route: '/admin/example',
      },
    ],
  },
  {
    id: 'extras',
    label: 'Extras',
    description: 'Additional pages and features',
    children: [
      {
        id: 'extras/error',
        label: 'Error page',
        icon: 'circle-x',
        route: 'error/404',
      },
      {
        id: 'extras/sign-in',
        label: 'Sign in',
        icon: 'log-in',
        route: '/auth/sign-in',
      },
      {
        id: 'extras/sign-up',
        label: 'Sign up',
        icon: 'log-out',
        route: '/auth/sign-up',
      },
      {
        id: 'extras/forgot-password',
        label: 'Forgot password',
        icon: 'rectangle-ellipsis',
        route: '/auth/forgot-password',
      },
      {
        id: 'extras/reset-password',
        label: 'Reset password',
        icon: 'rotate-ccw-key',
        route: '/auth/reset-password',
      },
    ],
  },
];
