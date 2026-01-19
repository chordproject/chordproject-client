import { Injectable } from '@angular/core';
import { format, sub } from 'date-fns';

export type BudgetDetail = {
  id: string;
  type: string;
  total: number;
  expensesAmount: number;
  expensesPercentage: number;
  remainingAmount: number;
  remainingPercentage: number;
};

@Injectable({ providedIn: 'root' })
export class ProjectDashboardService {
  // Data
  private now = new Date();
  data = {
    summary: [
      {
        title: 'Tasks',
        icon: 'list-todo',
        value: 21,
        change: {
          value: -4,
          unit: '',
          period: 'since last week',
          up: true,
        },
      },
      {
        title: 'Overdue',
        icon: 'clock-alert',
        value: 16,
        change: {
          value: 9,
          unit: '',
          period: 'since last week',
          up: false,
        },
      },
      {
        title: 'Issues',
        icon: 'bug',
        value: 24,
        change: {
          value: -3,
          unit: '',
          period: 'since yesterday',
          up: true,
        },
      },
      {
        title: 'Features',
        icon: 'git-branch-plus',
        value: 38,
        change: {
          value: 5,
          unit: '',
          period: 'since last week',
          up: false,
        },
      },
    ],
    issues: {
      overview: [
        {
          label: 'Fixed',
          value: 58,
        },
        {
          label: "Won't Fix",
          value: 32,
        },
        {
          label: 'Re-opened',
          value: 12,
        },
        {
          label: 'Needs Triage',
          value: 26,
        },
        {
          label: 'In Progress',
          value: 44,
        },
        {
          label: 'Total',
          value: 172,
        },
      ],
      chart: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        series: [
          {
            name: 'New issues',
            type: 'line',
            data: [42, 28, 43, 34, 20, 25, 22],
          },
          {
            name: 'Closed issues',
            type: 'column',
            data: [11, 10, 8, 11, 8, 10, 17],
          },
        ],
      },
    },
    taskDistribution: {
      chart: {
        labels: ['Feature', 'Bug', 'Refactor', 'Documentation', 'Other'],
        series: [17.65, 44.71, 5.88, 20.0, 11.76],
      },
    },
    schedule: [
      {
        title: 'Group Meeting',
        date: this.now,
        time: '09:00 AM',
        location: 'Conference room 1B',
      },
      {
        title: 'Coffee Break',
        date: this.now,
        time: '11:25 AM',
      },
      {
        title: 'Public Beta Release',
        date: this.now,
        time: '12:00 PM',
      },
      {
        title: 'Lunch',
        date: this.now,
        time: '01:00 PM',
      },
      {
        title: 'QA with July',
        date: this.now,
        time: '05:30 PM',
        location: 'Room 3F',
      },
      {
        title: "Jane's Birthday Party",
        date: this.now,
        time: '06:00 PM',
        location: 'Conference Room 5A',
      },
    ],
    budget: [
      {
        id: '1',
        type: 'Concept',
        total: 14880,
        expensesAmount: 14000,
        expensesPercentage: 94.08,
        remainingAmount: 880,
        remainingPercentage: 5.92,
      },
      {
        id: '2',
        type: 'Design',
        total: 21080,
        expensesAmount: 17240.34,
        expensesPercentage: 81.78,
        remainingAmount: 3839.66,
        remainingPercentage: 18.22,
      },
      {
        id: '3',
        type: 'Development',
        total: 34720,
        expensesAmount: 3518,
        expensesPercentage: 10.13,
        remainingAmount: 31202,
        remainingPercentage: 89.87,
      },
      {
        id: '4',
        type: 'Extras',
        total: 18600,
        expensesAmount: 0,
        expensesPercentage: 0,
        remainingAmount: 18600,
        remainingPercentage: 100,
      },
      {
        id: '5',
        type: 'Marketing',
        total: 34720,
        expensesAmount: 19859.84,
        expensesPercentage: 57.2,
        remainingAmount: 14860.16,
        remainingPercentage: 42.8,
      },
    ],
    budgetDistribution: {
      categories: ['Concept', 'Design', 'Development', 'Extras', 'Marketing'],
      series: [
        {
          name: 'Budget',
          data: [12, 20, 28, 15, 25],
        },
      ],
    },
    weeklyExpenses: {
      amount: 17663,
      labels: [
        format(sub(this.now, { days: 47 }), 'dd MMM') +
          ' - ' +
          format(sub(this.now, { days: 40 }), 'dd MMM'),
        format(sub(this.now, { days: 39 }), 'dd MMM') +
          ' - ' +
          format(sub(this.now, { days: 32 }), 'dd MMM'),
        format(sub(this.now, { days: 31 }), 'dd MMM') +
          ' - ' +
          format(sub(this.now, { days: 24 }), 'dd MMM'),
        format(sub(this.now, { days: 23 }), 'dd MMM') +
          ' - ' +
          format(sub(this.now, { days: 16 }), 'dd MMM'),
        format(sub(this.now, { days: 15 }), 'dd MMM') +
          ' - ' +
          format(sub(this.now, { days: 8 }), 'dd MMM'),
        format(sub(this.now, { days: 7 }), 'dd MMM') +
          ' - ' +
          format(this.now, 'dd MMM'),
      ],
      series: [
        {
          name: 'Expenses',
          data: [4412, 4345, 4541, 4677, 4322, 4123],
        },
      ],
    },
    monthlyExpenses: {
      amount: 54663,
      labels: [
        format(sub(this.now, { days: 31 }), 'dd MMM') +
          ' - ' +
          format(sub(this.now, { days: 24 }), 'dd MMM'),
        format(sub(this.now, { days: 23 }), 'dd MMM') +
          ' - ' +
          format(sub(this.now, { days: 16 }), 'dd MMM'),
        format(sub(this.now, { days: 15 }), 'dd MMM') +
          ' - ' +
          format(sub(this.now, { days: 8 }), 'dd MMM'),
        format(sub(this.now, { days: 7 }), 'dd MMM') +
          ' - ' +
          format(this.now, 'dd MMM'),
      ],
      series: [
        {
          name: 'Expenses',
          data: [15521, 15519, 15522, 15521],
        },
      ],
    },
    yearlyExpenses: {
      amount: 648813,
      labels: [
        format(sub(this.now, { days: 79 }), 'dd MMM') +
          ' - ' +
          format(sub(this.now, { days: 72 }), 'dd MMM'),
        format(sub(this.now, { days: 71 }), 'dd MMM') +
          ' - ' +
          format(sub(this.now, { days: 64 }), 'dd MMM'),
        format(sub(this.now, { days: 63 }), 'dd MMM') +
          ' - ' +
          format(sub(this.now, { days: 56 }), 'dd MMM'),
        format(sub(this.now, { days: 55 }), 'dd MMM') +
          ' - ' +
          format(sub(this.now, { days: 48 }), 'dd MMM'),
        format(sub(this.now, { days: 47 }), 'dd MMM') +
          ' - ' +
          format(sub(this.now, { days: 40 }), 'dd MMM'),
        format(sub(this.now, { days: 39 }), 'dd MMM') +
          ' - ' +
          format(sub(this.now, { days: 32 }), 'dd MMM'),
        format(sub(this.now, { days: 31 }), 'dd MMM') +
          ' - ' +
          format(sub(this.now, { days: 24 }), 'dd MMM'),
        format(sub(this.now, { days: 23 }), 'dd MMM') +
          ' - ' +
          format(sub(this.now, { days: 16 }), 'dd MMM'),
        format(sub(this.now, { days: 15 }), 'dd MMM') +
          ' - ' +
          format(sub(this.now, { days: 8 }), 'dd MMM'),
        format(sub(this.now, { days: 7 }), 'dd MMM') +
          ' - ' +
          format(this.now, 'dd MMM'),
      ],
      series: [
        {
          name: 'Expenses',
          data: [
            45891, 45801, 45834, 45843, 45800, 45900, 45814, 45856, 45910,
            45849,
          ],
        },
      ],
    },
    teamMembers: [
      {
        id: '2bfa2be5-7688-48d5-b5ac-dc0d9ac97f14',
        avatar: 'images/users/female-10.jpg',
        name: 'Nadia Mcknight',
        email: 'nadiamcknight@mail.com',
        phone: '+1-943-511-2203',
        title: 'Project Director',
      },
      {
        id: '77a4383b-b5a5-4943-bc46-04c3431d1566',
        avatar: 'images/users/male-19.jpg',
        name: 'Best Blackburn',
        email: 'blackburn.best@beadzza.me',
        phone: '+1-814-498-3701',
        title: 'Senior Developer',
      },
      {
        id: '8bb0f597-673a-47ca-8c77-2f83219cb9af',
        avatar: 'images/users/male-14.jpg',
        name: 'Duncan Carver',
        email: 'duncancarver@mail.info',
        phone: '+1-968-547-2111',
        title: 'Senior Developer',
      },
      {
        id: 'c318e31f-1d74-49c5-8dae-2bc5805e2fdb',
        avatar: 'images/users/male-01.jpg',
        name: 'Martin Richards',
        email: 'martinrichards@mail.biz',
        phone: '+1-902-500-2668',
        title: 'Junior Developer',
      },
      {
        id: '0a8bc517-631a-4a93-aacc-000fa2e8294c',
        avatar: 'images/users/female-20.jpg',
        name: 'Candice Munoz',
        email: 'candicemunoz@mail.co.uk',
        phone: '+1-838-562-2769',
        title: 'Lead Designer',
      },
      {
        id: 'a4c9945a-757b-40b0-8942-d20e0543cabd',
        avatar: 'images/users/female-01.jpg',
        name: 'Vickie Mosley',
        email: 'vickiemosley@mail.net',
        phone: '+1-939-555-3054',
        title: 'Designer',
      },
      {
        id: 'b8258ccf-48b5-46a2-9c95-e0bd7580c645',
        avatar: 'images/users/female-02.jpg',
        name: 'Tina Harris',
        email: 'tinaharris@mail.ca',
        phone: '+1-933-464-2431',
        title: 'Designer',
      },
      {
        id: 'f004ea79-98fc-436c-9ba5-6cfe32fe583d',
        avatar: 'images/users/male-02.jpg',
        name: 'Holt Manning',
        email: 'holtmanning@mail.org',
        phone: '+1-822-531-2600',
        title: 'Marketing Manager',
      },
      {
        id: '8b69fe2d-d7cc-4a3d-983d-559173e37d37',
        avatar: 'images/users/female-03.jpg',
        name: 'Misty Ramsey',
        email: 'mistyramsey@mail.us',
        phone: '+1-990-457-2106',
        title: 'Consultant',
      },
    ],
  };
}
