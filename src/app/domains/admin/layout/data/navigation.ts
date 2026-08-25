import { IsActiveMatchOptions } from '@angular/router';

export type NavigationItem = {
  id: string;
  label: string;
  dynamic?: boolean;
  category?: boolean;
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
        route: '/home',
      },
      {
        id: 'general/library',
        label: 'nav.library',
        icon: 'music',
        route: '/library',
      },
      {
        id: 'general/create',
        label: 'nav.create',
        icon: 'code-xml',
        route: '/songs/create',
      },
      {
        id: 'general/songbooks',
        label: 'nav.songbooks',
        icon: 'book-open',
        route: '/songbook',
      },
      {
        id: 'general/repertoires',
        label: 'nav.repertoires',
        icon: 'calendar-days',
        route: '/repertoires',
      },
    ],
  },
];
