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
    children: [
      {
        id: 'general/home',
        label: 'Home',
        icon: 'house',
        route: '/admin/home',
      },
      {
        id: 'general/library',
        label: 'Library',
        icon: 'music',
        route: '/admin/library',
      },
      {
        id: 'general/create',
        label: 'Create',
        icon: 'code-xml',
        route: '/admin/songs/create',
      },
      {
        id: 'general/songbooks',
        label: 'Songbooks',
        icon: 'book-open',
        route: '/admin/songbook',
      },
    ],
  },
  {
    id: 'extras',
    label: 'Extras',
    children: [
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
    ],
  },
];
