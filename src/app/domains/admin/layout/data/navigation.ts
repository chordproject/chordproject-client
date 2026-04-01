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
    id: 'dashboards',
    label: 'Dashboards',
    description: 'Overview of key metrics',
    children: [
      {
        id: 'dashboards/project',
        label: 'Project',
        icon: 'folder-kanban',
        route: '/admin/dashboards/project',
      },
      {
        id: 'dashboards/analytics',
        label: 'Analytics',
        icon: 'chart-area',
        route: '/admin/dashboards/analytics',
      },
      {
        id: 'dashboards/finance',
        label: 'Finance',
        icon: 'chart-candlestick',
        route: '/admin/dashboards/finance',
      },
    ],
  },
  {
    id: 'general',
    label: 'General',
    description: 'Commonly used apps',
    children: [
      {
        id: 'general/academy',
        label: 'Academy',
        icon: 'graduation-cap',
        route: '/admin/academy',
        activeOptions: { exact: false },
      },
      {
        id: 'general/contacts',
        label: 'Contacts',
        icon: 'contact-round',
        route: '/admin/contacts',
      },
      {
        id: 'general/file-manager',
        label: 'File Manager',
        icon: 'folder-tree',
        route: '/admin/file-manager',
      },
      {
        id: 'general/help-center',
        label: 'Help Center',
        icon: 'life-buoy',
        route: '/admin/help-center',
      },
      {
        id: 'general/notes',
        label: 'Notes',
        icon: 'notebook-pen',
        route: '/admin/notes',
      },
      {
        id: 'general/tasks',
        label: 'Tasks',
        icon: 'list-todo',
        badge: '10',
        route: '/admin/tasks',
        activeOptions: { exact: false },
      },
    ],
  },
  {
    id: 'extras',
    label: 'Extras',
    description: 'Additional pages and features',
    children: [
      {
        id: 'extras/settings',
        label: 'Settings',
        icon: 'settings',
        route: '/admin/settings',
        activeOptions: { exact: false },
      },
      {
        id: 'extras/notifications',
        label: 'Notifications',
        icon: 'bell',
        route: '/admin/notifications',
        activeOptions: { exact: false },
      },
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
      {
        id: 'extras/coming-soon',
        label: 'Coming soon',
        icon: 'traffic-cone',
        route: '/coming-soon',
      },
    ],
  },
  {
    id: 'documentation',
    label: 'Documentation',
    description: 'Resources for developers',
    children: [
      {
        id: 'documentation/changelog',
        label: 'Changelog',
        icon: 'logs',
        route: 'documentation/changelog',
      },
      {
        id: 'documentation/getting-started/installation',
        label: 'Installation',
        icon: 'download',
        route: 'documentation/getting-started/installation',
      },
      {
        id: 'documentation/getting-started/development',
        label: 'Development',
        icon: 'code',
        route: 'documentation/getting-started/development',
      },
      {
        id: 'documentation/getting-started/building',
        label: 'Building',
        icon: 'blocks',
        route: 'documentation/getting-started/building',
      },
    ],
  },
];
