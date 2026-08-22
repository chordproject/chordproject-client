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
        label: 'nav.home',
        icon: 'house',
        route: '/admin/home',
      },
      {
        id: 'general/library',
        label: 'nav.library',
        icon: 'music',
        route: '/admin/library',
      },
      {
        id: 'general/create',
        label: 'nav.create',
        icon: 'code-xml',
        route: '/admin/songs/create',
      },
      {
        id: 'general/songbooks',
        label: 'nav.songbooks',
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
        label: 'nav.sign_in',
        icon: 'log-in',
        route: '/auth/sign-in',
      },
      {
        id: 'extras/sign-up',
        label: 'nav.sign_up',
        icon: 'log-out',
        route: '/auth/sign-up',
      },
    ],
  },
];
