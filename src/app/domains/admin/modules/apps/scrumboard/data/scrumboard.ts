import { Injectable } from '@angular/core';
import {
  Card,
  Lane,
} from '@/app/domains/admin/modules/apps/scrumboard/data/model';

@Injectable({ providedIn: 'root' })
export class ScrumboardService {
  private lanes: Lane[] = [
    { id: 'backlog', label: 'Backlog' },
    { id: 'todo', label: 'Todo' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'in-review', label: 'In Review' },
    { id: 'testing', label: 'Testing' },
    { id: 'done', label: 'Done' },
  ];

  private cards: Card[] = [
    {
      id: 'SCRUM-1042',
      title: 'Migrate the auth module to standalone components',
      description:
        'Drop the legacy NgModule wrapper and move every auth feature to standalone components with lazy routes.',
      lane: 'backlog',
      priority: 'high',
      labels: ['Frontend', 'Refactor'],
      assignee: {
        name: 'Dejesus Michael',
        avatar: 'images/photos/male-01.jpg',
      },
      dueDate: '2026-08-21T00:00:00.000Z',
      subtasks: { total: 6, completed: 1 },
      comments: [
        {
          id: 'SCRUM-1042-1',
          author: {
            name: 'Carver Fuentes',
            avatar: 'images/photos/male-03.jpg',
          },
          message:
            'The auth guards are the tricky part here. They still pull the module injector, so they need to move to functional guards first.',
          createdAt: '2026-07-15T10:24:00.000Z',
          replies: [
            {
              id: 'SCRUM-1042-1-1',
              author: {
                name: 'Dejesus Michael',
                avatar: 'images/photos/male-01.jpg',
              },
              message:
                'Agreed. I split that out into its own subtask so the component migration stays reviewable.',
              createdAt: '2026-07-15T13:02:00.000Z',
            },
          ],
        },
        {
          id: 'SCRUM-1042-2',
          author: {
            name: 'Josefina Lloyd',
            avatar: 'images/photos/female-05.jpg',
          },
          message:
            'Please keep the route paths untouched, the marketing site links straight into /auth/sign-in.',
          createdAt: '2026-07-19T08:47:00.000Z',
        },
        {
          id: 'SCRUM-1042-3',
          author: {
            name: 'Shepard Cochran',
            avatar: 'images/photos/female-02.jpg',
          },
          message:
            'Lazy loading the reset-password screen shaved 40kb off the initial chunk in my local build.',
          createdAt: '2026-07-28T15:31:00.000Z',
        },
      ],
      createdAt: '2026-07-14T09:12:00.000Z',
    },
    {
      id: 'SCRUM-1043',
      title: 'Add rate limiting to the public API gateway',
      description:
        'Token bucket per API key, with a shared Redis counter so limits hold across instances.',
      lane: 'backlog',
      priority: 'urgent',
      labels: ['Api', 'Security'],
      assignee: {
        name: 'Barrera Bradshaw',
        avatar: 'images/photos/female-01.jpg',
      },
      dueDate: '2026-08-11T00:00:00.000Z',
      subtasks: { total: 4, completed: 0 },
      comments: [
        {
          id: 'SCRUM-1043-1',
          author: {
            name: 'Mcleod Wagner',
            avatar: 'images/photos/male-04.jpg',
          },
          message:
            'Token bucket over a Redis counter means one round trip per request. Worth benchmarking before we commit to it.',
          createdAt: '2026-07-17T09:38:00.000Z',
          replies: [
            {
              id: 'SCRUM-1043-1-1',
              author: {
                name: 'Barrera Bradshaw',
                avatar: 'images/photos/female-01.jpg',
              },
              message:
                'We can batch the refill with a Lua script, that keeps it to a single call.',
              createdAt: '2026-07-17T11:12:00.000Z',
            },
            {
              id: 'SCRUM-1043-1-2',
              author: {
                name: 'Trevino Bruce',
                avatar: 'images/photos/male-05.jpg',
              },
              message:
                'Do not forget the Retry-After header, the SDK clients back off on it.',
              createdAt: '2026-07-18T14:05:00.000Z',
            },
          ],
        },
        {
          id: 'SCRUM-1043-2',
          author: {
            name: 'Dejesus Michael',
            avatar: 'images/photos/male-01.jpg',
          },
          message:
            'Internal service keys should be exempt, otherwise the nightly sync will trip the limit.',
          createdAt: '2026-07-30T16:20:00.000Z',
        },
      ],
      createdAt: '2026-07-15T11:40:00.000Z',
    },
    {
      id: 'SCRUM-1044',
      title: 'Investigate flaky checkout e2e suite',
      description:
        'The suite fails roughly one run in five on CI but never locally. Suspect a race in the payment mock.',
      lane: 'backlog',
      priority: 'medium',
      labels: ['Testing'],
      assignee: null,
      dueDate: null,
      subtasks: null,
      comments: [
        {
          id: 'SCRUM-1044-1',
          author: {
            name: 'Alissa Vega',
            avatar: 'images/photos/female-03.jpg',
          },
          message:
            'Reran it twenty times on CI last night, four failures and all of them on the payment step.',
          createdAt: '2026-07-18T07:52:00.000Z',
        },
        {
          id: 'SCRUM-1044-2',
          author: {
            name: 'Carver Fuentes',
            avatar: 'images/photos/male-03.jpg',
          },
          message:
            'The mock resolves on a timer instead of a promise, so a slow CI runner lands after the assertion.',
          createdAt: '2026-07-21T12:16:00.000Z',
          replies: [
            {
              id: 'SCRUM-1044-2-1',
              author: {
                name: 'Kathrine Mccoy',
                avatar: 'images/photos/female-06.jpg',
              },
              message:
                'That matches the traces, the failing runs are always the ones over 400ms.',
              createdAt: '2026-07-21T15:44:00.000Z',
            },
          ],
        },
        {
          id: 'SCRUM-1044-3',
          author: {
            name: 'Wiggins Sanford',
            avatar: 'images/photos/female-04.jpg',
          },
          message:
            'Let us quarantine the suite until this lands, it is masking real failures in the nightly report.',
          createdAt: '2026-07-31T09:05:00.000Z',
        },
      ],
      createdAt: '2026-07-16T08:05:00.000Z',
    },
    {
      id: 'SCRUM-1045',
      title: 'Document the design token pipeline',
      lane: 'backlog',
      priority: 'low',
      labels: ['Docs'],
      assignee: {
        name: 'Nunez Faulkner',
        avatar: 'images/photos/male-02.jpg',
      },
      dueDate: '2026-09-02T00:00:00.000Z',
      subtasks: { total: 3, completed: 0 },
      comments: [],
      createdAt: '2026-07-17T13:22:00.000Z',
    },
    {
      id: 'SCRUM-1046',
      title: 'Replace moment.js with native Intl formatting',
      description:
        'Ships about 70kb we no longer need. Every call site already formats dates in one of four ways.',
      lane: 'backlog',
      priority: 'medium',
      labels: ['Frontend', 'Performance'],
      assignee: {
        name: 'Shepard Cochran',
        avatar: 'images/photos/female-02.jpg',
      },
      dueDate: null,
      subtasks: { total: 8, completed: 2 },
      comments: [
        {
          id: 'SCRUM-1046-1',
          author: {
            name: 'Nunez Faulkner',
            avatar: 'images/photos/male-02.jpg',
          },
          message:
            'Intl covers three of the four formats. The relative one we only use in two places, so a tiny helper is enough.',
          createdAt: '2026-07-22T10:33:00.000Z',
        },
        {
          id: 'SCRUM-1046-2',
          author: {
            name: 'Shepard Cochran',
            avatar: 'images/photos/female-02.jpg',
          },
          message:
            'Started with the dashboard widgets since they format the most dates. No visual diffs so far.',
          createdAt: '2026-07-29T14:09:00.000Z',
        },
      ],
      createdAt: '2026-07-18T15:47:00.000Z',
    },
    {
      id: 'SCRUM-1047',
      title: 'Spike: server-driven feature flags',
      lane: 'backlog',
      priority: 'none',
      labels: ['Research'],
      assignee: null,
      dueDate: null,
      subtasks: null,
      comments: [],
      createdAt: '2026-07-19T10:30:00.000Z',
    },
    {
      id: 'SCRUM-1048',
      title: 'Audit bundle size after the router upgrade',
      lane: 'backlog',
      priority: 'low',
      labels: ['Performance'],
      assignee: {
        name: 'Alissa Vega',
        avatar: 'images/photos/female-03.jpg',
      },
      dueDate: '2026-08-28T00:00:00.000Z',
      subtasks: { total: 2, completed: 0 },
      comments: [],
      createdAt: '2026-07-20T09:00:00.000Z',
    },
    {
      id: 'SCRUM-1049',
      title: 'Support keyboard navigation in the data grid',
      description:
        'Arrow keys move the focused cell, Home and End jump to row edges, and Enter opens the row drawer.',
      lane: 'todo',
      priority: 'high',
      labels: ['Frontend', 'Accessibility'],
      assignee: {
        name: 'Carver Fuentes',
        avatar: 'images/photos/male-03.jpg',
      },
      dueDate: '2026-08-09T00:00:00.000Z',
      subtasks: { total: 5, completed: 0 },
      comments: [
        {
          id: 'SCRUM-1049-1',
          author: {
            name: 'Kathrine Mccoy',
            avatar: 'images/photos/female-06.jpg',
          },
          message:
            'The grid needs a roving tabindex, otherwise every cell lands in the tab order and the page becomes unusable.',
          createdAt: '2026-07-23T09:26:00.000Z',
          replies: [
            {
              id: 'SCRUM-1049-1-1',
              author: {
                name: 'Carver Fuentes',
                avatar: 'images/photos/male-03.jpg',
              },
              message:
                'Planned, the focused cell is already tracked in a signal so it is a small step from here.',
              createdAt: '2026-07-23T11:47:00.000Z',
            },
          ],
        },
        {
          id: 'SCRUM-1049-2',
          author: {
            name: 'Wiggins Sanford',
            avatar: 'images/photos/female-04.jpg',
          },
          message:
            'Ctrl+Home should jump to the first cell of the first row, that is what people expect from spreadsheets.',
          createdAt: '2026-07-27T13:14:00.000Z',
        },
        {
          id: 'SCRUM-1049-3',
          author: {
            name: 'Alissa Vega',
            avatar: 'images/photos/female-03.jpg',
          },
          message:
            'Screen reader pass is on me once the focus model is in. Ping me when it hits review.',
          createdAt: '2026-08-01T08:52:00.000Z',
        },
      ],
      createdAt: '2026-07-21T14:18:00.000Z',
    },
    {
      id: 'SCRUM-1050',
      title: 'Persist user table preferences per workspace',
      lane: 'todo',
      priority: 'medium',
      labels: ['Api', 'Frontend'],
      assignee: {
        name: 'Wiggins Sanford',
        avatar: 'images/photos/female-04.jpg',
      },
      dueDate: '2026-08-14T00:00:00.000Z',
      subtasks: { total: 4, completed: 1 },
      comments: [
        {
          id: 'SCRUM-1050-1',
          author: {
            name: 'Nunez Faulkner',
            avatar: 'images/photos/male-02.jpg',
          },
          message:
            'Column widths and sort order are enough for a first pass. Filters can come later.',
          createdAt: '2026-07-25T10:41:00.000Z',
        },
        {
          id: 'SCRUM-1050-2',
          author: {
            name: 'Wiggins Sanford',
            avatar: 'images/photos/female-04.jpg',
          },
          message:
            'Storing this per workspace and not per user would surprise people who share a workspace.',
          createdAt: '2026-07-31T15:07:00.000Z',
        },
      ],
      createdAt: '2026-07-22T09:55:00.000Z',
    },
    {
      id: 'SCRUM-1051',
      title: 'Warn on unsaved changes when leaving the editor',
      lane: 'todo',
      priority: 'low',
      labels: ['Frontend'],
      assignee: null,
      dueDate: null,
      subtasks: null,
      comments: [],
      createdAt: '2026-07-22T16:04:00.000Z',
    },
    {
      id: 'SCRUM-1052',
      title: 'Add structured logging to the worker queue',
      description:
        'Every job should log a correlation id so a failed retry can be traced back to the original request.',
      lane: 'todo',
      priority: 'medium',
      labels: ['Backend', 'Observability'],
      assignee: {
        name: 'Mcleod Wagner',
        avatar: 'images/photos/male-04.jpg',
      },
      dueDate: '2026-08-18T00:00:00.000Z',
      subtasks: { total: 3, completed: 0 },
      comments: [],
      createdAt: '2026-07-23T11:10:00.000Z',
    },
    {
      id: 'SCRUM-1053',
      title: 'Rebuild the notification preferences screen',
      lane: 'in-progress',
      priority: 'high',
      labels: ['Frontend', 'Design'],
      assignee: {
        name: 'Alissa Vega',
        avatar: 'images/photos/female-03.jpg',
      },
      dueDate: '2026-08-07T00:00:00.000Z',
      subtasks: { total: 7, completed: 4 },
      comments: [
        {
          id: 'SCRUM-1053-1',
          author: {
            name: 'Josefina Lloyd',
            avatar: 'images/photos/female-05.jpg',
          },
          message:
            'Final designs are in Figma. The per-channel toggles are grouped by event now instead of by channel.',
          createdAt: '2026-07-26T09:33:00.000Z',
          replies: [
            {
              id: 'SCRUM-1053-1-1',
              author: {
                name: 'Alissa Vega',
                avatar: 'images/photos/female-03.jpg',
              },
              message:
                'Building against those, the grouping maps cleanly onto the existing preferences payload.',
              createdAt: '2026-07-26T12:18:00.000Z',
            },
          ],
        },
        {
          id: 'SCRUM-1053-2',
          author: {
            name: 'Dejesus Michael',
            avatar: 'images/photos/male-01.jpg',
          },
          message:
            'Keep the mute-all switch above the fold, it is the most used control on the current screen.',
          createdAt: '2026-07-30T11:02:00.000Z',
        },
        {
          id: 'SCRUM-1053-3',
          author: {
            name: 'Trevino Bruce',
            avatar: 'images/photos/male-05.jpg',
          },
          message:
            'Saving needs a debounce, the old screen fired a request on every toggle.',
          createdAt: '2026-08-02T10:26:00.000Z',
        },
      ],
      createdAt: '2026-07-24T08:41:00.000Z',
    },
    {
      id: 'SCRUM-1054',
      title: 'Fix memory leak in the websocket reconnect loop',
      description:
        'Each reconnect attaches a new listener without tearing down the previous socket.',
      lane: 'in-progress',
      priority: 'urgent',
      labels: ['Bug', 'Backend'],
      assignee: {
        name: 'Carver Fuentes',
        avatar: 'images/photos/male-03.jpg',
      },
      dueDate: '2026-08-05T00:00:00.000Z',
      subtasks: { total: 3, completed: 2 },
      comments: [
        {
          id: 'SCRUM-1054-1',
          author: {
            name: 'Mcleod Wagner',
            avatar: 'images/photos/male-04.jpg',
          },
          message:
            'Heap snapshots show the listener count climbing by one per reconnect, so the old socket never gets collected.',
          createdAt: '2026-07-26T08:14:00.000Z',
          replies: [
            {
              id: 'SCRUM-1054-1-1',
              author: {
                name: 'Carver Fuentes',
                avatar: 'images/photos/male-03.jpg',
              },
              message:
                'Found it. The teardown runs on close but the reconnect timer fires before close resolves.',
              createdAt: '2026-07-27T10:49:00.000Z',
            },
            {
              id: 'SCRUM-1054-1-2',
              author: {
                name: 'Barrera Bradshaw',
                avatar: 'images/photos/female-01.jpg',
              },
              message:
                'Worth adding a listener-count assertion to the socket tests so this cannot come back.',
              createdAt: '2026-07-27T14:23:00.000Z',
            },
          ],
        },
        {
          id: 'SCRUM-1054-2',
          author: {
            name: 'Kathrine Mccoy',
            avatar: 'images/photos/female-06.jpg',
          },
          message:
            'Support has three tickets about tabs getting sluggish after a few hours. Likely the same root cause.',
          createdAt: '2026-07-29T16:37:00.000Z',
        },
        {
          id: 'SCRUM-1054-3',
          author: {
            name: 'Carver Fuentes',
            avatar: 'images/photos/male-03.jpg',
          },
          message:
            'Fix is up, ran a soak test overnight and the listener count stayed flat across 200 reconnects.',
          createdAt: '2026-08-02T09:11:00.000Z',
        },
      ],
      createdAt: '2026-07-24T17:26:00.000Z',
    },
    {
      id: 'SCRUM-1055',
      title: 'Ship the CSV export endpoint',
      lane: 'in-progress',
      priority: 'medium',
      labels: ['Api'],
      assignee: {
        name: 'Nunez Faulkner',
        avatar: 'images/photos/male-02.jpg',
      },
      dueDate: '2026-08-12T00:00:00.000Z',
      subtasks: { total: 5, completed: 3 },
      comments: [
        {
          id: 'SCRUM-1055-1',
          author: {
            name: 'Trevino Bruce',
            avatar: 'images/photos/male-05.jpg',
          },
          message:
            'Large exports should stream rather than buffer, some workspaces have well over a million rows.',
          createdAt: '2026-07-28T11:29:00.000Z',
          replies: [
            {
              id: 'SCRUM-1055-1-1',
              author: {
                name: 'Nunez Faulkner',
                avatar: 'images/photos/male-02.jpg',
              },
              message:
                'It streams already. The open question is whether we cap the row count or let it run.',
              createdAt: '2026-07-28T13:55:00.000Z',
            },
          ],
        },
      ],
      createdAt: '2026-07-25T10:02:00.000Z',
    },
    {
      id: 'SCRUM-1056',
      title: 'Tighten the content security policy',
      lane: 'in-progress',
      priority: 'high',
      labels: ['Security'],
      assignee: {
        name: 'Barrera Bradshaw',
        avatar: 'images/photos/female-01.jpg',
      },
      dueDate: null,
      subtasks: null,
      comments: [],
      createdAt: '2026-07-25T12:35:00.000Z',
    },
    {
      id: 'SCRUM-1057',
      title: 'Extract the pagination logic into a shared helper',
      lane: 'in-review',
      priority: 'low',
      labels: ['Refactor'],
      assignee: {
        name: 'Shepard Cochran',
        avatar: 'images/photos/female-02.jpg',
      },
      dueDate: '2026-08-06T00:00:00.000Z',
      subtasks: { total: 2, completed: 2 },
      comments: [
        {
          id: 'SCRUM-1057-1',
          author: {
            name: 'Shepard Cochran',
            avatar: 'images/photos/female-02.jpg',
          },
          message:
            'Four call sites now share the helper. The odd one out is the audit log, it pages by cursor instead of offset.',
          createdAt: '2026-07-28T10:07:00.000Z',
        },
        {
          id: 'SCRUM-1057-2',
          author: {
            name: 'Josefina Lloyd',
            avatar: 'images/photos/female-05.jpg',
          },
          message:
            'Left a couple of notes on the PR, mostly naming. The logic itself reads well.',
          createdAt: '2026-07-31T14:42:00.000Z',
        },
      ],
      createdAt: '2026-07-26T09:19:00.000Z',
    },
    {
      id: 'SCRUM-1058',
      title: 'Cache avatar lookups on the profile service',
      description:
        'The profile page issues one request per avatar. A short lived in-memory cache removes most of them.',
      lane: 'in-review',
      priority: 'medium',
      labels: ['Backend', 'Performance'],
      assignee: {
        name: 'Mcleod Wagner',
        avatar: 'images/photos/male-04.jpg',
      },
      dueDate: '2026-08-08T00:00:00.000Z',
      subtasks: { total: 4, completed: 4 },
      comments: [],
      createdAt: '2026-07-26T15:48:00.000Z',
    },
    {
      id: 'SCRUM-1059',
      title: 'Add dark mode tokens to the chart palette',
      lane: 'in-review',
      priority: 'low',
      labels: ['Design', 'Frontend'],
      assignee: {
        name: 'Wiggins Sanford',
        avatar: 'images/photos/female-04.jpg',
      },
      dueDate: null,
      subtasks: null,
      comments: [],
      createdAt: '2026-07-27T11:03:00.000Z',
    },
    {
      id: 'SCRUM-1060',
      title: 'Verify the invoice PDF renderer across locales',
      description:
        'Right to left layouts push the totals column off the page in the current template.',
      lane: 'testing',
      priority: 'high',
      labels: ['Testing', 'Bug'],
      assignee: {
        name: 'Dejesus Michael',
        avatar: 'images/photos/male-01.jpg',
      },
      dueDate: '2026-08-04T00:00:00.000Z',
      subtasks: { total: 6, completed: 5 },
      comments: [
        {
          id: 'SCRUM-1060-1',
          author: {
            name: 'Wiggins Sanford',
            avatar: 'images/photos/female-04.jpg',
          },
          message:
            'Arabic and Hebrew both overflow. German is fine but the header wraps onto a second line.',
          createdAt: '2026-07-29T09:48:00.000Z',
          replies: [
            {
              id: 'SCRUM-1060-1-1',
              author: {
                name: 'Dejesus Michael',
                avatar: 'images/photos/male-01.jpg',
              },
              message:
                'The totals column is absolutely positioned, that is what breaks under RTL. Reworking it as a grid.',
              createdAt: '2026-07-30T08:21:00.000Z',
            },
          ],
        },
        {
          id: 'SCRUM-1060-2',
          author: {
            name: 'Kathrine Mccoy',
            avatar: 'images/photos/female-06.jpg',
          },
          message:
            'Added sample invoices for all twelve locales to the fixtures folder.',
          createdAt: '2026-08-01T13:36:00.000Z',
        },
      ],
      createdAt: '2026-07-28T08:27:00.000Z',
    },
    {
      id: 'SCRUM-1061',
      title: 'Regression pass on the onboarding flow',
      lane: 'testing',
      priority: 'medium',
      labels: ['Testing'],
      assignee: {
        name: 'Alissa Vega',
        avatar: 'images/photos/female-03.jpg',
      },
      dueDate: '2026-08-06T00:00:00.000Z',
      subtasks: { total: 9, completed: 6 },
      comments: [],
      createdAt: '2026-07-28T13:52:00.000Z',
    },
    {
      id: 'SCRUM-1062',
      title: 'Load test the search index after the shard split',
      lane: 'testing',
      priority: 'urgent',
      labels: ['Backend', 'Performance'],
      assignee: null,
      dueDate: '2026-08-03T00:00:00.000Z',
      subtasks: { total: 3, completed: 1 },
      comments: [
        {
          id: 'SCRUM-1062-1',
          author: {
            name: 'Mcleod Wagner',
            avatar: 'images/photos/male-04.jpg',
          },
          message:
            'Baseline from before the split is in the shared drive, we should compare p95 against that rather than against staging.',
          createdAt: '2026-07-30T10:18:00.000Z',
        },
        {
          id: 'SCRUM-1062-2',
          author: {
            name: 'Trevino Bruce',
            avatar: 'images/photos/male-05.jpg',
          },
          message:
            'Needs an owner before Monday, the shard split is blocked on these numbers.',
          createdAt: '2026-08-01T16:44:00.000Z',
        },
      ],
      createdAt: '2026-07-29T09:14:00.000Z',
    },
    {
      id: 'SCRUM-1063',
      title: 'Move CI artifacts to the new object storage bucket',
      lane: 'done',
      priority: 'medium',
      labels: ['DevOps'],
      assignee: {
        name: 'Mcleod Wagner',
        avatar: 'images/photos/male-04.jpg',
      },
      dueDate: '2026-07-30T00:00:00.000Z',
      subtasks: { total: 4, completed: 4 },
      comments: [],
      createdAt: '2026-07-12T10:44:00.000Z',
    },
    {
      id: 'SCRUM-1064',
      title: 'Fix the truncated tooltip on narrow viewports',
      lane: 'done',
      priority: 'low',
      labels: ['Bug', 'Frontend'],
      assignee: {
        name: 'Shepard Cochran',
        avatar: 'images/photos/female-02.jpg',
      },
      dueDate: '2026-07-29T00:00:00.000Z',
      subtasks: null,
      comments: [
        {
          id: 'SCRUM-1064-1',
          author: {
            name: 'Josefina Lloyd',
            avatar: 'images/photos/female-05.jpg',
          },
          message:
            'Verified on a 320px viewport, the tooltip wraps now instead of clipping. Thanks for the quick turnaround.',
          createdAt: '2026-07-28T09:23:00.000Z',
        },
      ],
      createdAt: '2026-07-13T16:31:00.000Z',
    },
    {
      id: 'SCRUM-1065',
      title: 'Roll out the new sign-in screen behind a flag',
      description:
        'Enabled for internal accounts first, then a ten percent slice of new signups.',
      lane: 'done',
      priority: 'high',
      labels: ['Frontend', 'Release'],
      assignee: {
        name: 'Nunez Faulkner',
        avatar: 'images/photos/male-02.jpg',
      },
      dueDate: '2026-07-27T00:00:00.000Z',
      subtasks: { total: 5, completed: 5 },
      comments: [
        {
          id: 'SCRUM-1065-1',
          author: {
            name: 'Barrera Bradshaw',
            avatar: 'images/photos/female-01.jpg',
          },
          message:
            'Flag is live for internal accounts. No errors in the first day, sign-in success rate is unchanged.',
          createdAt: '2026-07-21T09:31:00.000Z',
          replies: [
            {
              id: 'SCRUM-1065-1-1',
              author: {
                name: 'Nunez Faulkner',
                avatar: 'images/photos/male-02.jpg',
              },
              message:
                'Bumping to ten percent of new signups tomorrow morning, will watch the funnel for a couple of days.',
              createdAt: '2026-07-22T08:14:00.000Z',
            },
            {
              id: 'SCRUM-1065-1-2',
              author: {
                name: 'Josefina Lloyd',
                avatar: 'images/photos/female-05.jpg',
              },
              message:
                'Copy tweak on the password hint shipped with it, the old wording confused a few testers.',
              createdAt: '2026-07-22T11:56:00.000Z',
            },
          ],
        },
        {
          id: 'SCRUM-1065-2',
          author: {
            name: 'Dejesus Michael',
            avatar: 'images/photos/male-01.jpg',
          },
          message:
            'Rolled out to everyone and the old screen is deleted. Closing this one.',
          createdAt: '2026-07-27T15:20:00.000Z',
        },
      ],
      createdAt: '2026-07-11T09:07:00.000Z',
    },
  ];

  data = {
    lanes: this.lanes,
    cards: this.cards,
  };
}
