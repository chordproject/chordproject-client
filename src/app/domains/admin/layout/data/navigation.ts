import { IsActiveMatchOptions } from '@angular/router';

export type NavigationItem = {
  id: string;
  label: string;
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
    children: [
      /*{
        id: 'contacts',
        label: 'Contacts',
        icon: 'contact-round',
        route: '/admin/contacts',
      },
      {
        id: 'mailbox',
        label: 'Mailbox',
        icon: 'mail',
        route: '/admin/mailbox',
      },
      {
        id: 'projects',
        label: 'Projects',
        icon: 'folder-kanban',
        route: '/admin/projects',
      },
      {
        id: 'tasks',
        label: 'Tasks',
        icon: 'list-todo',
        route: '/admin/tasks',
      },
      {
        id: 'calendar',
        label: 'Calendar',
        icon: 'calendar-days',
        route: '/admin/calendar',
      },
      {
        id: 'inbox',
        label: 'Inbox',
        icon: 'mail',
        route: '/admin/inbox',
      },
      {
        id: 'file-manager',
        label: 'File manager',
        icon: 'folder-tree',
        route: '/admin/file-manager',
      },
      {
        id: 'audit-logs',
        label: 'Audit logs',
        icon: 'file-clock',
        route: '/admin/audit-logs',
      },
      {
        id: 'users',
        label: 'Users',
        icon: 'users',
        route: '/admin/users',
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: 'settings',
        route: '/admin/settings',
      },*/
      {
        id: 'general/academy',
        label: 'Academy',
        icon: 'graduation-cap',
        route: '/admin/academy',
        activeOptions: { exact: false },
      },
      {
        id: 'general/chat',
        label: 'Chat',
        icon: 'message-circle',
        route: '/admin/chat',
      },
      {
        id: 'general/contacts',
        label: 'Contacts',
        icon: 'contact-round',
        route: '/admin/contacts',
      },
      {
        id: 'general/inventory',
        label: 'Inventory',
        icon: 'warehouse',
        route: '/admin/inventory',
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
        id: 'general/inbox',
        label: 'Inbox',
        icon: 'mail',
        route: '/admin/inbox',
      },
      {
        id: 'general/notes',
        label: 'Notes',
        icon: 'notebook-pen',
        route: '/admin/notes',
      },
      {
        id: 'general/scrumboard',
        label: 'Scrumboard',
        icon: 'square-kanban',
        route: '/admin/scrumboard',
      },
      {
        id: 'general/tasks',
        label: 'Tasks',
        icon: 'list-todo',
        route: '/admin/tasks',
        activeOptions: { exact: false },
      },
    ],
  },
  {
    id: 'extras',
    label: 'Extras',
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
        route: '/notifications',
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
];

/*
import { FuseNavigationItem } from '@fuse/components/navigation';

export const navigation: FuseNavigationItem[] = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    subtitle: 'Unique dashboard designs',
    type: 'group',
    icon: 'house',
    children: [
      {
        id: 'dashboards.project',
        title: 'Project',
        type: 'basic',
        icon: 'clipboard-check',
        link: '/admin/dashboards/project',
      },
      {
        id: 'dashboards.analytics',
        title: 'Analytics',
        type: 'basic',
        icon: 'chart-no-axes-combined',
        link: '/admin/dashboards/analytics',
      },
      {
        id: 'dashboards.finance',
        title: 'Finance',
        type: 'basic',
        icon: 'wallet',
        link: '/admin/dashboards/finance',
      },
      {
        id: 'dashboards.crypto',
        title: 'Crypto',
        type: 'basic',
        icon: 'coins',
        link: '/admin/dashboards/crypto',
      },
    ],
  },
  {
    id: 'apps',
    title: 'Applications',
    subtitle: 'Custom made application designs',
    type: 'group',
    icon: 'layout-grid',
    children: [
      {
        id: 'apps.academy',
        title: 'Academy',
        type: 'basic',
        icon: 'graduation-cap',
        link: '/admin/apps/academy',
      },
      {
        id: 'apps.chat',
        title: 'Chat',
        type: 'basic',
        icon: 'message-square-text',
        link: '/admin/apps/chat',
      },
      {
        id: 'apps.contacts',
        title: 'Contacts',
        type: 'basic',
        icon: 'contact',
        link: '/admin/apps/contacts',
      },
      {
        id: 'apps.ecommerce',
        title: 'ECommerce',
        type: 'collapsable',
        icon: 'shopping-cart',
        children: [
          {
            id: 'apps.ecommerce.inventory',
            title: 'Inventory',
            type: 'basic',
            link: '/admin/apps/ecommerce/inventory',
          },
        ],
      },
      {
        id: 'apps.file-manager',
        title: 'File Manager',
        type: 'basic',
        icon: 'folder-sync',
        link: '/admin/apps/file-manager',
      },
      {
        id: 'apps.help-center',
        title: 'Help Center',
        type: 'collapsable',
        icon: 'message-circle-question-mark',
        link: '/admin/apps/help-center',
        children: [
          {
            id: 'apps.help-center.home',
            title: 'Home',
            type: 'basic',
            link: '/admin/apps/help-center',
            exactMatch: true,
          },
          {
            id: 'apps.help-center.faqs',
            title: 'FAQs',
            type: 'basic',
            link: '/admin/apps/help-center/faqs',
          },
          {
            id: 'apps.help-center.guides',
            title: 'Guides',
            type: 'basic',
            link: '/admin/apps/help-center/guides',
          },
          {
            id: 'apps.help-center.support',
            title: 'Support',
            type: 'basic',
            link: '/admin/apps/help-center/support',
          },
        ],
      },
      {
        id: 'apps.mailbox',
        title: 'Mailbox',
        type: 'basic',
        icon: 'inbox',
        link: '/admin/apps/mailbox',
        badge: {
          title: '27',
          classes: 'px-2 bg-pink-600 text-white rounded-full',
        },
      },
      {
        id: 'apps.notes',
        title: 'Notes',
        type: 'basic',
        icon: 'notebook-text',
        link: '/admin/apps/notes',
      },
      {
        id: 'apps.scrumboard',
        title: 'Scrumboard',
        type: 'basic',
        icon: 'square-kanban',
        link: '/admin/apps/scrumboard',
      },
      {
        id: 'apps.tasks',
        title: 'Tasks',
        type: 'basic',
        icon: 'list-todo',
        link: '/admin/apps/tasks',
      },
    ],
  },
  {
    id: 'pages',
    title: 'Pages',
    subtitle: 'Custom made page designs',
    type: 'group',
    icon: 'file',
    children: [
      {
        id: 'pages.activities',
        title: 'Activities',
        type: 'basic',
        icon: 'logs',
        link: '/admin/pages/activities',
      },
      {
        id: 'pages.authentication',
        title: 'Authentication',
        type: 'collapsable',
        icon: 'lock-keyhole',
        children: [
          {
            id: 'pages.authentication.sign-in',
            title: 'Sign in',
            type: 'basic',
            link: '/auth/sign-in',
          },
          {
            id: 'pages.authentication.sign-up',
            title: 'Sign up',
            type: 'basic',
            link: '/auth/sign-up',
          },
          {
            id: 'pages.authentication.forgot-password',
            title: 'Forgot password',
            type: 'basic',
            link: '/auth/forgot-password',
          },
          {
            id: 'pages.authentication.reset-password',
            title: 'Reset password',
            type: 'basic',
            link: '/auth/reset-password',
          },
        ],
      },
      {
        id: 'pages.coming-soon',
        title: 'Coming Soon',
        type: 'collapsable',
        icon: 'clock',
        link: '/admin/pages/coming-soon',
        children: [
          {
            id: 'pages.coming-soon.classic',
            title: 'Classic',
            type: 'basic',
            link: '/admin/pages/coming-soon/classic',
          },
          {
            id: 'pages.coming-soon.modern',
            title: 'Modern',
            type: 'basic',
            link: '/admin/pages/coming-soon/modern',
          },
          {
            id: 'pages.coming-soon.modern-reversed',
            title: 'Modern Reversed',
            type: 'basic',
            link: '/admin/pages/coming-soon/modern-reversed',
          },
          {
            id: 'pages.coming-soon.split-screen',
            title: 'Split Screen',
            type: 'basic',
            link: '/admin/pages/coming-soon/split-screen',
          },
          {
            id: 'pages.coming-soon.split-screen-reversed',
            title: 'Split Screen Reversed',
            type: 'basic',
            link: '/admin/pages/coming-soon/split-screen-reversed',
          },
          {
            id: 'pages.coming-soon.fullscreen',
            title: 'Fullscreen',
            type: 'basic',
            link: '/admin/pages/coming-soon/fullscreen',
          },
          {
            id: 'pages.coming-soon.fullscreen-reversed',
            title: 'Fullscreen Reversed',
            type: 'basic',
            link: '/admin/pages/coming-soon/fullscreen-reversed',
          },
        ],
      },
      {
        id: 'pages.error',
        title: 'Error',
        type: 'collapsable',
        icon: 'octagon-x',
        children: [
          {
            id: 'pages.error.404',
            title: '404',
            type: 'basic',
            link: '/admin/pages/error/404',
          },
          {
            id: 'pages.error.500',
            title: '500',
            type: 'basic',
            link: '/admin/pages/error/500',
          },
        ],
      },
      {
        id: 'pages.invoice',
        title: 'Invoice',
        type: 'collapsable',
        icon: 'receipt-text',
        children: [
          {
            id: 'pages.invoice.printable',
            title: 'Printable',
            type: 'collapsable',
            children: [
              {
                id: 'pages.invoice.printable.compact',
                title: 'Compact',
                type: 'basic',
                link: '/admin/pages/invoice/printable/compact',
              },
              {
                id: 'pages.invoice.printable.modern',
                title: 'Modern',
                type: 'basic',
                link: '/admin/pages/invoice/printable/modern',
              },
            ],
          },
        ],
      },
      {
        id: 'pages.maintenance',
        title: 'Maintenance',
        type: 'basic',
        icon: 'construction',
        link: '/admin/pages/maintenance',
      },
      {
        id: 'pages.pricing',
        title: 'Pricing',
        type: 'collapsable',
        icon: 'banknote',
        children: [
          {
            id: 'pages.pricing.modern',
            title: 'Modern',
            type: 'basic',
            link: '/admin/pages/pricing/modern',
          },
          {
            id: 'pages.pricing.simple',
            title: 'Simple',
            type: 'basic',
            link: '/admin/pages/pricing/simple',
          },
          {
            id: 'pages.pricing.single',
            title: 'Single',
            type: 'basic',
            link: '/admin/pages/pricing/single',
          },
          {
            id: 'pages.pricing.table',
            title: 'Table',
            type: 'basic',
            link: '/admin/pages/pricing/table',
          },
        ],
      },
      {
        id: 'pages.profile',
        title: 'Profile',
        type: 'basic',
        icon: 'circle-user-round',
        link: '/admin/pages/profile',
      },
      {
        id: 'pages.settings',
        title: 'Settings',
        type: 'basic',
        icon: 'settings',
        link: '/admin/pages/settings',
      },
    ],
  },
];
*/
