import { Injectable } from '@angular/core';
import { add, format, startOfDay, sub } from 'date-fns';

export type Transaction = {
  id: string;
  transactionId: string;
  name: string;
  amount: number;
  status: string;
  date: string;
};

@Injectable({ providedIn: 'root' })
export class FinanceDashboardService {
  // Data
  private now = new Date();

  private recentTransactions: Transaction[] = [
    {
      id: '1b6fd296-bc6a-4d45-bf4f-e45519a58cf5',
      transactionId: '528651571NT',
      name: 'Morgan Page',
      amount: +1358.75,
      status: 'completed',
      date: sub(this.now, { months: 1, days: 3 }).toDateString(),
    },
    {
      id: '2dec6074-98bd-4623-9526-6480e4776569',
      transactionId: '421436904YT',
      name: 'Nita Hebert',
      amount: -1042.82,
      status: 'completed',
      date: sub(this.now, { months: 2, days: 2 }).toDateString(),
    },
    {
      id: 'ae7c065f-4197-4021-a799-7a221822ad1d',
      transactionId: '685377421YT',
      name: 'Marsha Chambers',
      amount: +1828.16,
      status: 'pending',
      date: sub(this.now, { months: 2, days: 12 }).toDateString(),
    },
    {
      id: '0c43dd40-74f6-49d5-848a-57a4a45772ab',
      transactionId: '884960091RT',
      name: 'Charmaine Jackson',
      amount: +1647.55,
      status: 'completed',
      date: sub(this.now, { months: 2, days: 24 }).toDateString(),
    },
    {
      id: 'e5c9f0ed-a64c-4bfe-a113-29f80b4e162c',
      transactionId: '361402213NT',
      name: 'Maura Carey',
      amount: -927.43,
      status: 'completed',
      date: sub(this.now, { months: 3, days: 4 }).toDateString(),
    },
  ];

  data = {
    accountBalance: {
      growRate: 38.33,
      ami: 45332,
      series: [
        {
          name: 'Predicted',
          data: [
            {
              x: add(sub(this.now, { months: 12 }), { days: 1 }),
              y: 48.84,
            },
            {
              x: add(sub(this.now, { months: 12 }), { days: 4 }),
              y: 53.51,
            },
            {
              x: add(sub(this.now, { months: 12 }), { days: 7 }),
              y: 52.93,
            },
            {
              x: add(sub(this.now, { months: 12 }), { days: 10 }),
              y: 49.08,
            },
            {
              x: add(sub(this.now, { months: 12 }), { days: 13 }),
              y: 50.27,
            },
            {
              x: add(sub(this.now, { months: 12 }), { days: 16 }),
              y: 48.37,
            },
            {
              x: add(sub(this.now, { months: 12 }), { days: 19 }),
              y: 44.84,
            },
            {
              x: add(sub(this.now, { months: 12 }), { days: 22 }),
              y: 40.71,
            },
            {
              x: add(sub(this.now, { months: 12 }), { days: 25 }),
              y: 41.24,
            },
            {
              x: add(sub(this.now, { months: 12 }), { days: 28 }),
              y: 45.63,
            },
            {
              x: add(sub(this.now, { months: 11 }), { days: 1 }),
              y: 38.2,
            },
            {
              x: add(sub(this.now, { months: 11 }), { days: 4 }),
              y: 39.68,
            },
            {
              x: add(sub(this.now, { months: 11 }), { days: 7 }),
              y: 41.02,
            },
            {
              x: add(sub(this.now, { months: 11 }), { days: 10 }),
              y: 39.41,
            },
            {
              x: add(sub(this.now, { months: 11 }), { days: 13 }),
              y: 35.66,
            },
            {
              x: add(sub(this.now, { months: 11 }), { days: 16 }),
              y: 38.53,
            },
            {
              x: add(sub(this.now, { months: 11 }), { days: 19 }),
              y: 38.53,
            },
            {
              x: add(sub(this.now, { months: 11 }), { days: 22 }),
              y: 40.69,
            },
            {
              x: add(sub(this.now, { months: 11 }), { days: 25 }),
              y: 38.79,
            },
            {
              x: add(sub(this.now, { months: 11 }), { days: 28 }),
              y: 42.98,
            },
            {
              x: add(sub(this.now, { months: 10 }), { days: 1 }),
              y: 43.55,
            },
            {
              x: add(sub(this.now, { months: 10 }), { days: 4 }),
              y: 40.65,
            },
            {
              x: add(sub(this.now, { months: 10 }), { days: 7 }),
              y: 36.5,
            },
            {
              x: add(sub(this.now, { months: 10 }), { days: 10 }),
              y: 33.79,
            },
            {
              x: add(sub(this.now, { months: 10 }), { days: 13 }),
              y: 31.91,
            },
            {
              x: add(sub(this.now, { months: 10 }), { days: 16 }),
              y: 29.68,
            },
            {
              x: add(sub(this.now, { months: 10 }), { days: 19 }),
              y: 29.57,
            },
            {
              x: add(sub(this.now, { months: 10 }), { days: 22 }),
              y: 33.13,
            },
            {
              x: add(sub(this.now, { months: 10 }), { days: 25 }),
              y: 37.08,
            },
            {
              x: add(sub(this.now, { months: 10 }), { days: 28 }),
              y: 35.86,
            },
            {
              x: add(sub(this.now, { months: 9 }), { days: 1 }),
              y: 39.65,
            },
            {
              x: add(sub(this.now, { months: 9 }), { days: 4 }),
              y: 39.01,
            },
            {
              x: add(sub(this.now, { months: 9 }), { days: 7 }),
              y: 34.1,
            },
            {
              x: add(sub(this.now, { months: 9 }), { days: 10 }),
              y: 37.48,
            },
            {
              x: add(sub(this.now, { months: 9 }), { days: 13 }),
              y: 39.29,
            },
            {
              x: add(sub(this.now, { months: 9 }), { days: 16 }),
              y: 38.46,
            },
            {
              x: add(sub(this.now, { months: 9 }), { days: 19 }),
              y: 37.71,
            },
            {
              x: add(sub(this.now, { months: 9 }), { days: 22 }),
              y: 40.15,
            },
            {
              x: add(sub(this.now, { months: 9 }), { days: 25 }),
              y: 35.89,
            },
            {
              x: add(sub(this.now, { months: 9 }), { days: 28 }),
              y: 31.5,
            },
            {
              x: add(sub(this.now, { months: 8 }), { days: 1 }),
              y: 30.5,
            },
            {
              x: add(sub(this.now, { months: 8 }), { days: 4 }),
              y: 25.74,
            },
            {
              x: add(sub(this.now, { months: 8 }), { days: 7 }),
              y: 28.23,
            },
            {
              x: add(sub(this.now, { months: 8 }), { days: 10 }),
              y: 28.48,
            },
            {
              x: add(sub(this.now, { months: 8 }), { days: 13 }),
              y: 30.0,
            },
            {
              x: add(sub(this.now, { months: 8 }), { days: 16 }),
              y: 32.16,
            },
            {
              x: add(sub(this.now, { months: 8 }), { days: 19 }),
              y: 32.99,
            },
            {
              x: add(sub(this.now, { months: 8 }), { days: 22 }),
              y: 37.68,
            },
            {
              x: add(sub(this.now, { months: 8 }), { days: 25 }),
              y: 35.24,
            },
            {
              x: add(sub(this.now, { months: 8 }), { days: 28 }),
              y: 39.18,
            },
            {
              x: add(sub(this.now, { months: 7 }), { days: 1 }),
              y: 41.45,
            },
            {
              x: add(sub(this.now, { months: 7 }), { days: 4 }),
              y: 43.78,
            },
            {
              x: add(sub(this.now, { months: 7 }), { days: 7 }),
              y: 39.41,
            },
            {
              x: add(sub(this.now, { months: 7 }), { days: 10 }),
              y: 39.32,
            },
            {
              x: add(sub(this.now, { months: 7 }), { days: 13 }),
              y: 43.8,
            },
            {
              x: add(sub(this.now, { months: 7 }), { days: 16 }),
              y: 42.43,
            },
            {
              x: add(sub(this.now, { months: 7 }), { days: 19 }),
              y: 43.67,
            },
            {
              x: add(sub(this.now, { months: 7 }), { days: 22 }),
              y: 38.79,
            },
            {
              x: add(sub(this.now, { months: 7 }), { days: 25 }),
              y: 43.57,
            },
            {
              x: add(sub(this.now, { months: 7 }), { days: 28 }),
              y: 41.81,
            },
            {
              x: add(sub(this.now, { months: 6 }), { days: 1 }),
              y: 46.19,
            },
            {
              x: add(sub(this.now, { months: 6 }), { days: 4 }),
              y: 47.69,
            },
            {
              x: add(sub(this.now, { months: 6 }), { days: 7 }),
              y: 49.01,
            },
            {
              x: add(sub(this.now, { months: 6 }), { days: 10 }),
              y: 46.4,
            },
            {
              x: add(sub(this.now, { months: 6 }), { days: 13 }),
              y: 51.28,
            },
            {
              x: add(sub(this.now, { months: 6 }), { days: 16 }),
              y: 50.15,
            },
            {
              x: add(sub(this.now, { months: 6 }), { days: 19 }),
              y: 53.6,
            },
            {
              x: add(sub(this.now, { months: 6 }), { days: 22 }),
              y: 56.08,
            },
            {
              x: add(sub(this.now, { months: 6 }), { days: 25 }),
              y: 52.72,
            },
            {
              x: add(sub(this.now, { months: 6 }), { days: 28 }),
              y: 56.6,
            },
            {
              x: add(sub(this.now, { months: 5 }), { days: 1 }),
              y: 58.36,
            },
            {
              x: add(sub(this.now, { months: 5 }), { days: 4 }),
              y: 56.59,
            },
            {
              x: add(sub(this.now, { months: 5 }), { days: 7 }),
              y: 55.75,
            },
            {
              x: add(sub(this.now, { months: 5 }), { days: 10 }),
              y: 54.74,
            },
            {
              x: add(sub(this.now, { months: 5 }), { days: 13 }),
              y: 54.27,
            },
            {
              x: add(sub(this.now, { months: 5 }), { days: 16 }),
              y: 58.65,
            },
            {
              x: add(sub(this.now, { months: 5 }), { days: 19 }),
              y: 57.0,
            },
            {
              x: add(sub(this.now, { months: 5 }), { days: 22 }),
              y: 60.52,
            },
            {
              x: add(sub(this.now, { months: 5 }), { days: 25 }),
              y: 57.6,
            },
            {
              x: add(sub(this.now, { months: 5 }), { days: 28 }),
              y: 56.48,
            },
            {
              x: add(sub(this.now, { months: 4 }), { days: 1 }),
              y: 54.35,
            },
            {
              x: add(sub(this.now, { months: 4 }), { days: 4 }),
              y: 52.39,
            },
            {
              x: add(sub(this.now, { months: 4 }), { days: 7 }),
              y: 54.52,
            },
            {
              x: add(sub(this.now, { months: 4 }), { days: 10 }),
              y: 54.16,
            },
            {
              x: add(sub(this.now, { months: 4 }), { days: 13 }),
              y: 51.95,
            },
            {
              x: add(sub(this.now, { months: 4 }), { days: 16 }),
              y: 51.19,
            },
            {
              x: add(sub(this.now, { months: 4 }), { days: 19 }),
              y: 46.35,
            },
            {
              x: add(sub(this.now, { months: 4 }), { days: 22 }),
              y: 48.33,
            },
            {
              x: add(sub(this.now, { months: 4 }), { days: 25 }),
              y: 45.84,
            },
            {
              x: add(sub(this.now, { months: 4 }), { days: 28 }),
              y: 48.22,
            },
            {
              x: add(sub(this.now, { months: 3 }), { days: 1 }),
              y: 45.82,
            },
            {
              x: add(sub(this.now, { months: 3 }), { days: 4 }),
              y: 43.48,
            },
            {
              x: add(sub(this.now, { months: 3 }), { days: 7 }),
              y: 41.32,
            },
            {
              x: add(sub(this.now, { months: 3 }), { days: 10 }),
              y: 40.99,
            },
            {
              x: add(sub(this.now, { months: 3 }), { days: 13 }),
              y: 38.49,
            },
            {
              x: add(sub(this.now, { months: 3 }), { days: 16 }),
              y: 40.1,
            },
            {
              x: add(sub(this.now, { months: 3 }), { days: 19 }),
              y: 44.86,
            },
            {
              x: add(sub(this.now, { months: 3 }), { days: 22 }),
              y: 44.03,
            },
            {
              x: add(sub(this.now, { months: 3 }), { days: 25 }),
              y: 41.41,
            },
            {
              x: add(sub(this.now, { months: 3 }), { days: 28 }),
              y: 37.8,
            },
            {
              x: add(sub(this.now, { months: 2 }), { days: 1 }),
              y: 35.24,
            },
            {
              x: add(sub(this.now, { months: 2 }), { days: 4 }),
              y: 32.12,
            },
            {
              x: add(sub(this.now, { months: 2 }), { days: 7 }),
              y: 35.68,
            },
            {
              x: add(sub(this.now, { months: 2 }), { days: 10 }),
              y: 38.0,
            },
            {
              x: add(sub(this.now, { months: 2 }), { days: 13 }),
              y: 37.96,
            },
            {
              x: add(sub(this.now, { months: 2 }), { days: 16 }),
              y: 38.7,
            },
            {
              x: add(sub(this.now, { months: 2 }), { days: 19 }),
              y: 37.45,
            },
            {
              x: add(sub(this.now, { months: 2 }), { days: 22 }),
              y: 37.51,
            },
            {
              x: add(sub(this.now, { months: 2 }), { days: 25 }),
              y: 33.1,
            },
            {
              x: add(sub(this.now, { months: 2 }), { days: 28 }),
              y: 35.09,
            },
            {
              x: add(sub(this.now, { months: 1 }), { days: 1 }),
              y: 31.87,
            },
            {
              x: add(sub(this.now, { months: 1 }), { days: 4 }),
              y: 29.18,
            },
            {
              x: add(sub(this.now, { months: 1 }), { days: 7 }),
              y: 31.91,
            },
            {
              x: add(sub(this.now, { months: 1 }), { days: 10 }),
              y: 34.37,
            },
            {
              x: add(sub(this.now, { months: 1 }), { days: 13 }),
              y: 32.91,
            },
            {
              x: add(sub(this.now, { months: 1 }), { days: 16 }),
              y: 33.17,
            },
            {
              x: add(sub(this.now, { months: 1 }), { days: 19 }),
              y: 37.16,
            },
            {
              x: add(sub(this.now, { months: 1 }), { days: 22 }),
              y: 32.6,
            },
            {
              x: add(sub(this.now, { months: 1 }), { days: 25 }),
              y: 36.94,
            },
            {
              x: add(sub(this.now, { months: 1 }), { days: 28 }),
              y: 35.98,
            },
          ],
        },
        {
          name: 'Actual',
          data: [
            {
              x: add(sub(this.now, { months: 12 }), { days: 1 }),
              y: 20.21,
            },
            {
              x: add(sub(this.now, { months: 12 }), { days: 4 }),
              y: 17.49,
            },
            {
              x: add(sub(this.now, { months: 12 }), { days: 7 }),
              y: 16.54,
            },
            {
              x: add(sub(this.now, { months: 12 }), { days: 10 }),
              y: 19.0,
            },
            {
              x: add(sub(this.now, { months: 12 }), { days: 13 }),
              y: 16.47,
            },
            {
              x: add(sub(this.now, { months: 12 }), { days: 16 }),
              y: 13.15,
            },
            {
              x: add(sub(this.now, { months: 12 }), { days: 19 }),
              y: 18.07,
            },
            {
              x: add(sub(this.now, { months: 12 }), { days: 22 }),
              y: 17.93,
            },
            {
              x: add(sub(this.now, { months: 12 }), { days: 25 }),
              y: 18.92,
            },
            {
              x: add(sub(this.now, { months: 12 }), { days: 28 }),
              y: 18.46,
            },
            {
              x: add(sub(this.now, { months: 11 }), { days: 1 }),
              y: 18.04,
            },
            {
              x: add(sub(this.now, { months: 11 }), { days: 4 }),
              y: 17.78,
            },
            {
              x: add(sub(this.now, { months: 11 }), { days: 7 }),
              y: 20.15,
            },
            {
              x: add(sub(this.now, { months: 11 }), { days: 10 }),
              y: 18.92,
            },
            {
              x: add(sub(this.now, { months: 11 }), { days: 13 }),
              y: 17.08,
            },
            {
              x: add(sub(this.now, { months: 11 }), { days: 16 }),
              y: 17.11,
            },
            {
              x: add(sub(this.now, { months: 11 }), { days: 19 }),
              y: 15.7,
            },
            {
              x: add(sub(this.now, { months: 11 }), { days: 22 }),
              y: 15.07,
            },
            {
              x: add(sub(this.now, { months: 11 }), { days: 25 }),
              y: 14.51,
            },
            {
              x: add(sub(this.now, { months: 11 }), { days: 28 }),
              y: 15.22,
            },
            {
              x: add(sub(this.now, { months: 10 }), { days: 1 }),
              y: 19.77,
            },
            {
              x: add(sub(this.now, { months: 10 }), { days: 4 }),
              y: 23.67,
            },
            {
              x: add(sub(this.now, { months: 10 }), { days: 7 }),
              y: 27.98,
            },
            {
              x: add(sub(this.now, { months: 10 }), { days: 10 }),
              y: 30.8,
            },
            {
              x: add(sub(this.now, { months: 10 }), { days: 13 }),
              y: 28.56,
            },
            {
              x: add(sub(this.now, { months: 10 }), { days: 16 }),
              y: 27.45,
            },
            {
              x: add(sub(this.now, { months: 10 }), { days: 19 }),
              y: 27.5,
            },
            {
              x: add(sub(this.now, { months: 10 }), { days: 22 }),
              y: 27.28,
            },
            {
              x: add(sub(this.now, { months: 10 }), { days: 25 }),
              y: 24.36,
            },
            {
              x: add(sub(this.now, { months: 10 }), { days: 28 }),
              y: 22.89,
            },
            {
              x: add(sub(this.now, { months: 9 }), { days: 1 }),
              y: 28.04,
            },
            {
              x: add(sub(this.now, { months: 9 }), { days: 4 }),
              y: 27.77,
            },
            {
              x: add(sub(this.now, { months: 9 }), { days: 7 }),
              y: 30.24,
            },
            {
              x: add(sub(this.now, { months: 9 }), { days: 10 }),
              y: 26.57,
            },
            {
              x: add(sub(this.now, { months: 9 }), { days: 13 }),
              y: 22.18,
            },
            {
              x: add(sub(this.now, { months: 9 }), { days: 16 }),
              y: 19.64,
            },
            {
              x: add(sub(this.now, { months: 9 }), { days: 19 }),
              y: 16.74,
            },
            {
              x: add(sub(this.now, { months: 9 }), { days: 22 }),
              y: 17.21,
            },
            {
              x: add(sub(this.now, { months: 9 }), { days: 25 }),
              y: 20.05,
            },
            {
              x: add(sub(this.now, { months: 9 }), { days: 28 }),
              y: 16.13,
            },
            {
              x: add(sub(this.now, { months: 8 }), { days: 1 }),
              y: 10.71,
            },
            {
              x: add(sub(this.now, { months: 8 }), { days: 4 }),
              y: 7.99,
            },
            {
              x: add(sub(this.now, { months: 8 }), { days: 7 }),
              y: 11.33,
            },
            {
              x: add(sub(this.now, { months: 8 }), { days: 10 }),
              y: 15.36,
            },
            {
              x: add(sub(this.now, { months: 8 }), { days: 13 }),
              y: 20.16,
            },
            {
              x: add(sub(this.now, { months: 8 }), { days: 16 }),
              y: 22.56,
            },
            {
              x: add(sub(this.now, { months: 8 }), { days: 19 }),
              y: 19.34,
            },
            {
              x: add(sub(this.now, { months: 8 }), { days: 22 }),
              y: 18.32,
            },
            {
              x: add(sub(this.now, { months: 8 }), { days: 25 }),
              y: 20.75,
            },
            {
              x: add(sub(this.now, { months: 8 }), { days: 28 }),
              y: 17.09,
            },
            {
              x: add(sub(this.now, { months: 7 }), { days: 1 }),
              y: 18.31,
            },
            {
              x: add(sub(this.now, { months: 7 }), { days: 4 }),
              y: 14.34,
            },
            {
              x: add(sub(this.now, { months: 7 }), { days: 7 }),
              y: 9.93,
            },
            {
              x: add(sub(this.now, { months: 7 }), { days: 10 }),
              y: 10.64,
            },
            {
              x: add(sub(this.now, { months: 7 }), { days: 13 }),
              y: 6.18,
            },
            {
              x: add(sub(this.now, { months: 7 }), { days: 16 }),
              y: 10.32,
            },
            {
              x: add(sub(this.now, { months: 7 }), { days: 19 }),
              y: 12.8,
            },
            {
              x: add(sub(this.now, { months: 7 }), { days: 22 }),
              y: 13.44,
            },
            {
              x: add(sub(this.now, { months: 7 }), { days: 25 }),
              y: 18.35,
            },
            {
              x: add(sub(this.now, { months: 7 }), { days: 28 }),
              y: 22.87,
            },
            {
              x: add(sub(this.now, { months: 6 }), { days: 1 }),
              y: 26.92,
            },
            {
              x: add(sub(this.now, { months: 6 }), { days: 4 }),
              y: 22.5,
            },
            {
              x: add(sub(this.now, { months: 6 }), { days: 7 }),
              y: 18.14,
            },
            {
              x: add(sub(this.now, { months: 6 }), { days: 10 }),
              y: 19.06,
            },
            {
              x: add(sub(this.now, { months: 6 }), { days: 13 }),
              y: 19.73,
            },
            {
              x: add(sub(this.now, { months: 6 }), { days: 16 }),
              y: 18.82,
            },
            {
              x: add(sub(this.now, { months: 6 }), { days: 19 }),
              y: 23.33,
            },
            {
              x: add(sub(this.now, { months: 6 }), { days: 22 }),
              y: 20.48,
            },
            {
              x: add(sub(this.now, { months: 6 }), { days: 25 }),
              y: 25.47,
            },
            {
              x: add(sub(this.now, { months: 6 }), { days: 28 }),
              y: 28.84,
            },
            {
              x: add(sub(this.now, { months: 5 }), { days: 1 }),
              y: 27.71,
            },
            {
              x: add(sub(this.now, { months: 5 }), { days: 4 }),
              y: 25.22,
            },
            {
              x: add(sub(this.now, { months: 5 }), { days: 7 }),
              y: 25.43,
            },
            {
              x: add(sub(this.now, { months: 5 }), { days: 10 }),
              y: 24.13,
            },
            {
              x: add(sub(this.now, { months: 5 }), { days: 13 }),
              y: 20.02,
            },
            {
              x: add(sub(this.now, { months: 5 }), { days: 16 }),
              y: 18.38,
            },
            {
              x: add(sub(this.now, { months: 5 }), { days: 19 }),
              y: 18.3,
            },
            {
              x: add(sub(this.now, { months: 5 }), { days: 22 }),
              y: 18.72,
            },
            {
              x: add(sub(this.now, { months: 5 }), { days: 25 }),
              y: 22.46,
            },
            {
              x: add(sub(this.now, { months: 5 }), { days: 28 }),
              y: 21.71,
            },
            {
              x: add(sub(this.now, { months: 4 }), { days: 1 }),
              y: 29.88,
            },
            {
              x: add(sub(this.now, { months: 4 }), { days: 4 }),
              y: 26.94,
            },
            {
              x: add(sub(this.now, { months: 4 }), { days: 7 }),
              y: 28.06,
            },
            {
              x: add(sub(this.now, { months: 4 }), { days: 10 }),
              y: 30.4,
            },
            {
              x: add(sub(this.now, { months: 4 }), { days: 13 }),
              y: 28.98,
            },
            {
              x: add(sub(this.now, { months: 4 }), { days: 16 }),
              y: 30.13,
            },
            {
              x: add(sub(this.now, { months: 4 }), { days: 19 }),
              y: 27.6,
            },
            {
              x: add(sub(this.now, { months: 4 }), { days: 22 }),
              y: 30.21,
            },
            {
              x: add(sub(this.now, { months: 4 }), { days: 25 }),
              y: 26.88,
            },
            {
              x: add(sub(this.now, { months: 4 }), { days: 28 }),
              y: 25.72,
            },
            {
              x: add(sub(this.now, { months: 3 }), { days: 1 }),
              y: 27.89,
            },
            {
              x: add(sub(this.now, { months: 3 }), { days: 4 }),
              y: 30.69,
            },
            {
              x: add(sub(this.now, { months: 3 }), { days: 7 }),
              y: 31.42,
            },
            {
              x: add(sub(this.now, { months: 3 }), { days: 10 }),
              y: 36.14,
            },
            {
              x: add(sub(this.now, { months: 3 }), { days: 13 }),
              y: 32.02,
            },
            {
              x: add(sub(this.now, { months: 3 }), { days: 16 }),
              y: 27.3,
            },
            {
              x: add(sub(this.now, { months: 3 }), { days: 19 }),
              y: 29.51,
            },
            {
              x: add(sub(this.now, { months: 3 }), { days: 22 }),
              y: 32.67,
            },
            {
              x: add(sub(this.now, { months: 3 }), { days: 25 }),
              y: 28.82,
            },
            {
              x: add(sub(this.now, { months: 3 }), { days: 28 }),
              y: 28.85,
            },
            {
              x: add(sub(this.now, { months: 2 }), { days: 1 }),
              y: 29.15,
            },
            {
              x: add(sub(this.now, { months: 2 }), { days: 4 }),
              y: 27.9,
            },
            {
              x: add(sub(this.now, { months: 2 }), { days: 7 }),
              y: 30.71,
            },
            {
              x: add(sub(this.now, { months: 2 }), { days: 10 }),
              y: 28.02,
            },
            {
              x: add(sub(this.now, { months: 2 }), { days: 13 }),
              y: 23.82,
            },
            {
              x: add(sub(this.now, { months: 2 }), { days: 16 }),
              y: 18.83,
            },
            {
              x: add(sub(this.now, { months: 2 }), { days: 19 }),
              y: 14.48,
            },
            {
              x: add(sub(this.now, { months: 2 }), { days: 22 }),
              y: 11.76,
            },
            {
              x: add(sub(this.now, { months: 2 }), { days: 25 }),
              y: 12.75,
            },
            {
              x: add(sub(this.now, { months: 2 }), { days: 28 }),
              y: 11.36,
            },
            {
              x: add(sub(this.now, { months: 1 }), { days: 1 }),
              y: 11.6,
            },
            {
              x: add(sub(this.now, { months: 1 }), { days: 4 }),
              y: 15.24,
            },
            {
              x: add(sub(this.now, { months: 1 }), { days: 7 }),
              y: 13.05,
            },
            {
              x: add(sub(this.now, { months: 1 }), { days: 10 }),
              y: 17.25,
            },
            {
              x: add(sub(this.now, { months: 1 }), { days: 13 }),
              y: 18.5,
            },
            {
              x: add(sub(this.now, { months: 1 }), { days: 16 }),
              y: 23.04,
            },
            {
              x: add(sub(this.now, { months: 1 }), { days: 19 }),
              y: 21.87,
            },
            {
              x: add(sub(this.now, { months: 1 }), { days: 22 }),
              y: 25.97,
            },
            {
              x: add(sub(this.now, { months: 1 }), { days: 25 }),
              y: 22.46,
            },
            {
              x: add(sub(this.now, { months: 1 }), { days: 28 }),
              y: 17.67,
            },
          ],
        },
      ],
    },
    budget: {
      expenses: 11763.34,
      expensesLimit: 20000,
      savings: 10974.12,
      savingsGoal: 250000,
      bills: 1789.22,
      billsLimit: 1000,
    },
    previousStatement: {
      status: 'paid',
      date: format(sub(startOfDay(this.now), { days: 15 }), 'PP'),
      limit: 34500,
      spent: 27221.21,
      minimum: 7331.94,
    },
    currentStatement: {
      status: 'pending',
      date: format(
        add(sub(startOfDay(this.now), { days: 15 }), { months: 1 }),
        'PP'
      ),
      limit: 34500,
      spent: 39819.41,
      minimum: 9112.51,
    },
    recentTransactions: this.recentTransactions,
  };
}
