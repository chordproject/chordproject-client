import { Injectable } from '@angular/core';
import { format, sub } from 'date-fns';

export type Order = {
  id: string;
  date: string;
  customer: string;
  amount: number;
  status: string;
};

@Injectable({ providedIn: 'root' })
export class SalesDashboardService {
  private now = new Date();

  // Data
  data = {
    summary: [
      {
        title: 'New Customers',
        icon: 'user-plus',
        value: 1404,
        change: {
          value: 12.4,
          unit: '%',
          period: 'since last month',
          up: true,
        },
      },
      {
        title: 'Total Orders',
        icon: 'truck',
        value: 1200,
        change: {
          value: -8.7,
          unit: '%',
          period: 'since last month',
          up: false,
        },
      },
      {
        title: 'Total Revenue',
        icon: 'wallet',
        value: 15680.0,
        change: {
          value: 5.6,
          unit: '%',
          period: 'since last month',
          up: true,
        },
      },
      {
        title: 'Avg. Order Value',
        icon: 'hand-coins',
        value: 122,
        change: {
          value: 3.2,
          unit: '%',
          period: 'since last month',
          up: true,
        },
      },
    ],
    sales: {
      value: 45332,
      change: {
        value: 4.7,
        unit: '%',
        period: 'since last month',
        up: true,
      },
      chart: {
        series: [
          {
            name: 'This month',
            data: [
              {
                x: format(sub(this.now, { days: 1 }), 'dd MMM yy'),
                y: 4884,
              },
              {
                x: format(sub(this.now, { days: 2 }), 'dd MMM yy'),
                y: 5351,
              },
              {
                x: format(sub(this.now, { days: 3 }), 'dd MMM yy'),
                y: 5293,
              },
              {
                x: format(sub(this.now, { days: 4 }), 'dd MMM yy'),
                y: 4908,
              },
              {
                x: format(sub(this.now, { days: 5 }), 'dd MMM yy'),
                y: 5027,
              },
              {
                x: format(sub(this.now, { days: 6 }), 'dd MMM yy'),
                y: 4837,
              },
              {
                x: format(sub(this.now, { days: 7 }), 'dd MMM yy'),
                y: 4484,
              },
              {
                x: format(sub(this.now, { days: 8 }), 'dd MMM yy'),
                y: 4071,
              },
              {
                x: format(sub(this.now, { days: 9 }), 'dd MMM yy'),
                y: 4124,
              },
              {
                x: format(sub(this.now, { days: 10 }), 'dd MMM yy'),
                y: 4563,
              },
              {
                x: format(sub(this.now, { days: 11 }), 'dd MMM yy'),
                y: 3382,
              },
              {
                x: format(sub(this.now, { days: 12 }), 'dd MMM yy'),
                y: 3968,
              },
              {
                x: format(sub(this.now, { days: 13 }), 'dd MMM yy'),
                y: 4102,
              },
              {
                x: format(sub(this.now, { days: 14 }), 'dd MMM yy'),
                y: 3941,
              },
              {
                x: format(sub(this.now, { days: 15 }), 'dd MMM yy'),
                y: 3566,
              },
              {
                x: format(sub(this.now, { days: 16 }), 'dd MMM yy'),
                y: 3853,
              },
              {
                x: format(sub(this.now, { days: 17 }), 'dd MMM yy'),
                y: 3853,
              },
              {
                x: format(sub(this.now, { days: 18 }), 'dd MMM yy'),
                y: 4069,
              },
              {
                x: format(sub(this.now, { days: 19 }), 'dd MMM yy'),
                y: 3879,
              },
              {
                x: format(sub(this.now, { days: 20 }), 'dd MMM yy'),
                y: 4298,
              },
              {
                x: format(sub(this.now, { days: 21 }), 'dd MMM yy'),
                y: 4355,
              },
              {
                x: format(sub(this.now, { days: 22 }), 'dd MMM yy'),
                y: 4065,
              },
              {
                x: format(sub(this.now, { days: 23 }), 'dd MMM yy'),
                y: 3365,
              },
              {
                x: format(sub(this.now, { days: 24 }), 'dd MMM yy'),
                y: 3379,
              },
              {
                x: format(sub(this.now, { days: 25 }), 'dd MMM yy'),
                y: 3191,
              },
              {
                x: format(sub(this.now, { days: 26 }), 'dd MMM yy'),
                y: 2968,
              },
              {
                x: format(sub(this.now, { days: 27 }), 'dd MMM yy'),
                y: 2957,
              },
              {
                x: format(sub(this.now, { days: 28 }), 'dd MMM yy'),
                y: 3313,
              },
              {
                x: format(sub(this.now, { days: 29 }), 'dd MMM yy'),
                y: 3708,
              },
              {
                x: format(sub(this.now, { days: 30 }), 'dd MMM yy'),
                y: 3586,
              },
            ],
          },
          {
            name: 'Last month',
            data: [
              {
                x: format(sub(this.now, { days: 1 }), 'dd MMM yy'),
                y: 2021,
              },
              {
                x: format(sub(this.now, { days: 2 }), 'dd MMM yy'),
                y: 1749,
              },
              {
                x: format(sub(this.now, { days: 3 }), 'dd MMM yy'),
                y: 1654,
              },
              {
                x: format(sub(this.now, { days: 4 }), 'dd MMM yy'),
                y: 1190,
              },
              {
                x: format(sub(this.now, { days: 5 }), 'dd MMM yy'),
                y: 1647,
              },
              {
                x: format(sub(this.now, { days: 6 }), 'dd MMM yy'),
                y: 1315,
              },
              {
                x: format(sub(this.now, { days: 7 }), 'dd MMM yy'),
                y: 1807,
              },
              {
                x: format(sub(this.now, { days: 8 }), 'dd MMM yy'),
                y: 1793,
              },
              {
                x: format(sub(this.now, { days: 9 }), 'dd MMM yy'),
                y: 1892,
              },
              {
                x: format(sub(this.now, { days: 10 }), 'dd MMM yy'),
                y: 1846,
              },
              {
                x: format(sub(this.now, { days: 11 }), 'dd MMM yy'),
                y: 1804,
              },
              {
                x: format(sub(this.now, { days: 12 }), 'dd MMM yy'),
                y: 1778,
              },
              {
                x: format(sub(this.now, { days: 13 }), 'dd MMM yy'),
                y: 2015,
              },
              {
                x: format(sub(this.now, { days: 14 }), 'dd MMM yy'),
                y: 1892,
              },
              {
                x: format(sub(this.now, { days: 15 }), 'dd MMM yy'),
                y: 1708,
              },
              {
                x: format(sub(this.now, { days: 16 }), 'dd MMM yy'),
                y: 1711,
              },
              {
                x: format(sub(this.now, { days: 17 }), 'dd MMM yy'),
                y: 1157,
              },
              {
                x: format(sub(this.now, { days: 18 }), 'dd MMM yy'),
                y: 1507,
              },
              {
                x: format(sub(this.now, { days: 19 }), 'dd MMM yy'),
                y: 1451,
              },
              {
                x: format(sub(this.now, { days: 20 }), 'dd MMM yy'),
                y: 1522,
              },
              {
                x: format(sub(this.now, { days: 21 }), 'dd MMM yy'),
                y: 1977,
              },
              {
                x: format(sub(this.now, { days: 22 }), 'dd MMM yy'),
                y: 2367,
              },
              {
                x: format(sub(this.now, { days: 23 }), 'dd MMM yy'),
                y: 2798,
              },
              {
                x: format(sub(this.now, { days: 24 }), 'dd MMM yy'),
                y: 2308,
              },
              {
                x: format(sub(this.now, { days: 25 }), 'dd MMM yy'),
                y: 2856,
              },
              {
                x: format(sub(this.now, { days: 26 }), 'dd MMM yy'),
                y: 2745,
              },
              {
                x: format(sub(this.now, { days: 27 }), 'dd MMM yy'),
                y: 1975,
              },
              {
                x: format(sub(this.now, { days: 28 }), 'dd MMM yy'),
                y: 2728,
              },
              {
                x: format(sub(this.now, { days: 29 }), 'dd MMM yy'),
                y: 2436,
              },
              {
                x: format(sub(this.now, { days: 30 }), 'dd MMM yy'),
                y: 2289,
              },
            ],
          },
        ],
      },
    },
    latestOrders: [
      {
        id: '784512',
        status: 'paid',
        customer: 'Daniel Rodriguez',
        amount: 249.99,
        date: '2025-11-18T14:32:11Z',
      },
      {
        id: '784519',
        status: 'fulfilled',
        customer: 'Emily Carter',
        amount: 89.0,
        date: '2025-11-17T09:18:44Z',
      },
      {
        id: '784526',
        status: 'pending',
        customer: 'Michael Thompson',
        amount: 129.5,
        date: '2025-11-19T16:05:02Z',
      },
      {
        id: '784533',
        status: 'cancelled',
        customer: 'Sophia Nguyen',
        amount: 59.99,
        date: '2025-11-15T11:42:27Z',
      },
      {
        id: '784540',
        status: 'paid',
        customer: 'James Wilson',
        amount: 399.0,
        date: '2025-11-20T08:21:55Z',
      },
      {
        id: '784548',
        status: 'fulfilled',
        customer: 'Olivia Martinez',
        amount: 179.99,
        date: '2025-11-16T18:10:33Z',
      },
      {
        id: '784556',
        status: 'refunded',
        customer: 'Benjamin Lee',
        amount: 99.0,
        date: '2025-11-12T13:57:41Z',
      },
      {
        id: '784563',
        status: 'paid',
        customer: 'Isabella Brown',
        amount: 549.0,
        date: '2025-11-21T10:46:09Z',
      },
      {
        id: '784571',
        status: 'returned',
        customer: 'Ethan Miller',
        amount: 74.99,
        date: '2025-11-10T15:29:18Z',
      },
      {
        id: '784579',
        status: 'pending',
        customer: 'Ava Johnson',
        amount: 219.0,
        date: '2025-11-22T19:03:54Z',
      },
      {
        id: '784586',
        status: 'paid',
        customer: 'Noah Anderson',
        amount: 149.99,
        date: '2025-11-18T07:11:26Z',
      },
      {
        id: '784594',
        status: 'fulfilled',
        customer: 'Mia Davis',
        amount: 89.99,
        date: '2025-11-14T12:44:08Z',
      },
      {
        id: '784602',
        status: 'cancelled',
        customer: 'Lucas Perez',
        amount: 59.0,
        date: '2025-11-09T09:52:36Z',
      },
      {
        id: '784610',
        status: 'paid',
        customer: 'Charlotte White',
        amount: 329.0,
        date: '2025-11-23T16:18:47Z',
      },
      {
        id: '784618',
        status: 'fulfilled',
        customer: 'Henry Clark',
        amount: 199.99,
        date: '2025-11-13T14:06:12Z',
      },
      {
        id: '784625',
        status: 'refunded',
        customer: 'Amelia Lewis',
        amount: 129.0,
        date: '2025-11-08T10:31:59Z',
      },
      {
        id: '784633',
        status: 'paid',
        customer: 'Alexander Walker',
        amount: 649.0,
        date: '2025-11-24T11:48:22Z',
      },
      {
        id: '784641',
        status: 'returned',
        customer: 'Harper Hall',
        amount: 89.5,
        date: '2025-11-07T17:40:03Z',
      },
      {
        id: '784649',
        status: 'pending',
        customer: 'Sebastian Young',
        amount: 159.0,
        date: '2025-11-25T08:55:19Z',
      },
      {
        id: '784657',
        status: 'paid',
        customer: 'Ella Hernandez',
        amount: 279.99,
        date: '2025-11-20T13:27:34Z',
      },
      {
        id: '784665',
        status: 'fulfilled',
        customer: 'Jack King',
        amount: 119.0,
        date: '2025-11-15T10:14:46Z',
      },
      {
        id: '784672',
        status: 'cancelled',
        customer: 'Lily Wright',
        amount: 49.99,
        date: '2025-11-06T09:03:21Z',
      },
      {
        id: '784680',
        status: 'paid',
        customer: 'William Lopez',
        amount: 499.0,
        date: '2025-11-26T18:36:58Z',
      },
      {
        id: '784688',
        status: 'fulfilled',
        customer: 'Grace Scott',
        amount: 169.0,
        date: '2025-11-17T16:59:07Z',
      },
      {
        id: '784696',
        status: 'refunded',
        customer: 'Owen Green',
        amount: 99.99,
        date: '2025-11-05T14:22:45Z',
      },
      {
        id: '784704',
        status: 'paid',
        customer: 'Chloe Adams',
        amount: 229.0,
        date: '2025-11-27T09:41:13Z',
      },
      {
        id: '784712',
        status: 'returned',
        customer: 'Matthew Baker',
        amount: 139.5,
        date: '2025-11-04T11:56:02Z',
      },
      {
        id: '784720',
        status: 'pending',
        customer: 'Victoria Nelson',
        amount: 189.0,
        date: '2025-11-28T15:08:37Z',
      },
      {
        id: '784728',
        status: 'paid',
        customer: 'David Ramirez',
        amount: 349.99,
        date: '2025-11-21T17:26:44Z',
      },
      {
        id: '784735',
        status: 'fulfilled',
        customer: 'Natalie Moore',
        amount: 109.0,
        date: '2025-11-16T08:49:51Z',
      },
    ],
  };
}
