import { Injectable } from '@angular/core';
import { add, format, sub } from 'date-fns';

@Injectable({ providedIn: 'root' })
export class AnalyticsDashboardService {
  // Data
  private now = new Date();
  data = {
    visitors: {
      series: {
        'this-year': [
          {
            name: 'Visitors',
            data: [
              {
                x: add(sub(this.now, { months: 12 }), { days: 1 }),
                y: 4884,
              },
              {
                x: add(sub(this.now, { months: 12 }), { days: 4 }),
                y: 5351,
              },
              {
                x: add(sub(this.now, { months: 12 }), { days: 7 }),
                y: 5293,
              },
              {
                x: add(sub(this.now, { months: 12 }), { days: 10 }),
                y: 4908,
              },
              {
                x: add(sub(this.now, { months: 12 }), { days: 13 }),
                y: 5027,
              },
              {
                x: add(sub(this.now, { months: 12 }), { days: 16 }),
                y: 4837,
              },
              {
                x: add(sub(this.now, { months: 12 }), { days: 19 }),
                y: 4484,
              },
              {
                x: add(sub(this.now, { months: 12 }), { days: 22 }),
                y: 4071,
              },
              {
                x: add(sub(this.now, { months: 12 }), { days: 25 }),
                y: 4124,
              },
              {
                x: add(sub(this.now, { months: 12 }), { days: 28 }),
                y: 4563,
              },
              {
                x: add(sub(this.now, { months: 11 }), { days: 1 }),
                y: 3820,
              },
              {
                x: add(sub(this.now, { months: 11 }), { days: 4 }),
                y: 3968,
              },
              {
                x: add(sub(this.now, { months: 11 }), { days: 7 }),
                y: 4102,
              },
              {
                x: add(sub(this.now, { months: 11 }), { days: 10 }),
                y: 3941,
              },
              {
                x: add(sub(this.now, { months: 11 }), { days: 13 }),
                y: 3566,
              },
              {
                x: add(sub(this.now, { months: 11 }), { days: 16 }),
                y: 3853,
              },
              {
                x: add(sub(this.now, { months: 11 }), { days: 19 }),
                y: 3853,
              },
              {
                x: add(sub(this.now, { months: 11 }), { days: 22 }),
                y: 4069,
              },
              {
                x: add(sub(this.now, { months: 11 }), { days: 25 }),
                y: 3879,
              },
              {
                x: add(sub(this.now, { months: 11 }), { days: 28 }),
                y: 4298,
              },
              {
                x: add(sub(this.now, { months: 10 }), { days: 1 }),
                y: 4355,
              },
              {
                x: add(sub(this.now, { months: 10 }), { days: 4 }),
                y: 4065,
              },
              {
                x: add(sub(this.now, { months: 10 }), { days: 7 }),
                y: 3650,
              },
              {
                x: add(sub(this.now, { months: 10 }), { days: 10 }),
                y: 3379,
              },
              {
                x: add(sub(this.now, { months: 10 }), { days: 13 }),
                y: 3191,
              },
              {
                x: add(sub(this.now, { months: 10 }), { days: 16 }),
                y: 2968,
              },
              {
                x: add(sub(this.now, { months: 10 }), { days: 19 }),
                y: 2957,
              },
              {
                x: add(sub(this.now, { months: 10 }), { days: 22 }),
                y: 3313,
              },
              {
                x: add(sub(this.now, { months: 10 }), { days: 25 }),
                y: 3708,
              },
              {
                x: add(sub(this.now, { months: 10 }), { days: 28 }),
                y: 3586,
              },
              {
                x: add(sub(this.now, { months: 9 }), { days: 1 }),
                y: 3965,
              },
              {
                x: add(sub(this.now, { months: 9 }), { days: 4 }),
                y: 3901,
              },
              {
                x: add(sub(this.now, { months: 9 }), { days: 7 }),
                y: 3410,
              },
              {
                x: add(sub(this.now, { months: 9 }), { days: 10 }),
                y: 3748,
              },
              {
                x: add(sub(this.now, { months: 9 }), { days: 13 }),
                y: 3929,
              },
              {
                x: add(sub(this.now, { months: 9 }), { days: 16 }),
                y: 3846,
              },
              {
                x: add(sub(this.now, { months: 9 }), { days: 19 }),
                y: 3771,
              },
              {
                x: add(sub(this.now, { months: 9 }), { days: 22 }),
                y: 4015,
              },
              {
                x: add(sub(this.now, { months: 9 }), { days: 25 }),
                y: 3589,
              },
              {
                x: add(sub(this.now, { months: 9 }), { days: 28 }),
                y: 3150,
              },
              {
                x: add(sub(this.now, { months: 8 }), { days: 1 }),
                y: 3050,
              },
              {
                x: add(sub(this.now, { months: 8 }), { days: 4 }),
                y: 2574,
              },
              {
                x: add(sub(this.now, { months: 8 }), { days: 7 }),
                y: 2823,
              },
              {
                x: add(sub(this.now, { months: 8 }), { days: 10 }),
                y: 2848,
              },
              {
                x: add(sub(this.now, { months: 8 }), { days: 13 }),
                y: 3000,
              },
              {
                x: add(sub(this.now, { months: 8 }), { days: 16 }),
                y: 3216,
              },
              {
                x: add(sub(this.now, { months: 8 }), { days: 19 }),
                y: 3299,
              },
              {
                x: add(sub(this.now, { months: 8 }), { days: 22 }),
                y: 3768,
              },
              {
                x: add(sub(this.now, { months: 8 }), { days: 25 }),
                y: 3524,
              },
              {
                x: add(sub(this.now, { months: 8 }), { days: 28 }),
                y: 3918,
              },
              {
                x: add(sub(this.now, { months: 7 }), { days: 1 }),
                y: 4145,
              },
              {
                x: add(sub(this.now, { months: 7 }), { days: 4 }),
                y: 4378,
              },
              {
                x: add(sub(this.now, { months: 7 }), { days: 7 }),
                y: 3941,
              },
              {
                x: add(sub(this.now, { months: 7 }), { days: 10 }),
                y: 3932,
              },
              {
                x: add(sub(this.now, { months: 7 }), { days: 13 }),
                y: 4380,
              },
              {
                x: add(sub(this.now, { months: 7 }), { days: 16 }),
                y: 4243,
              },
              {
                x: add(sub(this.now, { months: 7 }), { days: 19 }),
                y: 4367,
              },
              {
                x: add(sub(this.now, { months: 7 }), { days: 22 }),
                y: 3879,
              },
              {
                x: add(sub(this.now, { months: 7 }), { days: 25 }),
                y: 4357,
              },
              {
                x: add(sub(this.now, { months: 7 }), { days: 28 }),
                y: 4181,
              },
              {
                x: add(sub(this.now, { months: 6 }), { days: 1 }),
                y: 4619,
              },
              {
                x: add(sub(this.now, { months: 6 }), { days: 4 }),
                y: 4769,
              },
              {
                x: add(sub(this.now, { months: 6 }), { days: 7 }),
                y: 4901,
              },
              {
                x: add(sub(this.now, { months: 6 }), { days: 10 }),
                y: 4640,
              },
              {
                x: add(sub(this.now, { months: 6 }), { days: 13 }),
                y: 5128,
              },
              {
                x: add(sub(this.now, { months: 6 }), { days: 16 }),
                y: 5015,
              },
              {
                x: add(sub(this.now, { months: 6 }), { days: 19 }),
                y: 5360,
              },
              {
                x: add(sub(this.now, { months: 6 }), { days: 22 }),
                y: 5608,
              },
              {
                x: add(sub(this.now, { months: 6 }), { days: 25 }),
                y: 5272,
              },
              {
                x: add(sub(this.now, { months: 6 }), { days: 28 }),
                y: 5660,
              },
              {
                x: add(sub(this.now, { months: 5 }), { days: 1 }),
                y: 5836,
              },
              {
                x: add(sub(this.now, { months: 5 }), { days: 4 }),
                y: 5659,
              },
              {
                x: add(sub(this.now, { months: 5 }), { days: 7 }),
                y: 5575,
              },
              {
                x: add(sub(this.now, { months: 5 }), { days: 10 }),
                y: 5474,
              },
              {
                x: add(sub(this.now, { months: 5 }), { days: 13 }),
                y: 5427,
              },
              {
                x: add(sub(this.now, { months: 5 }), { days: 16 }),
                y: 5865,
              },
              {
                x: add(sub(this.now, { months: 5 }), { days: 19 }),
                y: 5700,
              },
              {
                x: add(sub(this.now, { months: 5 }), { days: 22 }),
                y: 6052,
              },
              {
                x: add(sub(this.now, { months: 5 }), { days: 25 }),
                y: 5760,
              },
              {
                x: add(sub(this.now, { months: 5 }), { days: 28 }),
                y: 5648,
              },
              {
                x: add(sub(this.now, { months: 4 }), { days: 1 }),
                y: 5435,
              },
              {
                x: add(sub(this.now, { months: 4 }), { days: 4 }),
                y: 5239,
              },
              {
                x: add(sub(this.now, { months: 4 }), { days: 7 }),
                y: 5452,
              },
              {
                x: add(sub(this.now, { months: 4 }), { days: 10 }),
                y: 5416,
              },
              {
                x: add(sub(this.now, { months: 4 }), { days: 13 }),
                y: 5195,
              },
              {
                x: add(sub(this.now, { months: 4 }), { days: 16 }),
                y: 5119,
              },
              {
                x: add(sub(this.now, { months: 4 }), { days: 19 }),
                y: 4635,
              },
              {
                x: add(sub(this.now, { months: 4 }), { days: 22 }),
                y: 4833,
              },
              {
                x: add(sub(this.now, { months: 4 }), { days: 25 }),
                y: 4584,
              },
              {
                x: add(sub(this.now, { months: 4 }), { days: 28 }),
                y: 4822,
              },
              {
                x: add(sub(this.now, { months: 3 }), { days: 1 }),
                y: 4582,
              },
              {
                x: add(sub(this.now, { months: 3 }), { days: 4 }),
                y: 4348,
              },
              {
                x: add(sub(this.now, { months: 3 }), { days: 7 }),
                y: 4132,
              },
              {
                x: add(sub(this.now, { months: 3 }), { days: 10 }),
                y: 4099,
              },
              {
                x: add(sub(this.now, { months: 3 }), { days: 13 }),
                y: 3849,
              },
              {
                x: add(sub(this.now, { months: 3 }), { days: 16 }),
                y: 4010,
              },
              {
                x: add(sub(this.now, { months: 3 }), { days: 19 }),
                y: 4486,
              },
              {
                x: add(sub(this.now, { months: 3 }), { days: 22 }),
                y: 4403,
              },
              {
                x: add(sub(this.now, { months: 3 }), { days: 25 }),
                y: 4141,
              },
              {
                x: add(sub(this.now, { months: 3 }), { days: 28 }),
                y: 3780,
              },
              {
                x: add(sub(this.now, { months: 2 }), { days: 1 }),
                y: 3524,
              },
              {
                x: add(sub(this.now, { months: 2 }), { days: 4 }),
                y: 3212,
              },
              {
                x: add(sub(this.now, { months: 2 }), { days: 7 }),
                y: 3568,
              },
              {
                x: add(sub(this.now, { months: 2 }), { days: 10 }),
                y: 3800,
              },
              {
                x: add(sub(this.now, { months: 2 }), { days: 13 }),
                y: 3796,
              },
              {
                x: add(sub(this.now, { months: 2 }), { days: 16 }),
                y: 3870,
              },
              {
                x: add(sub(this.now, { months: 2 }), { days: 19 }),
                y: 3745,
              },
              {
                x: add(sub(this.now, { months: 2 }), { days: 22 }),
                y: 3751,
              },
              {
                x: add(sub(this.now, { months: 2 }), { days: 25 }),
                y: 3310,
              },
              {
                x: add(sub(this.now, { months: 2 }), { days: 28 }),
                y: 3509,
              },
              {
                x: add(sub(this.now, { months: 1 }), { days: 1 }),
                y: 3187,
              },
              {
                x: add(sub(this.now, { months: 1 }), { days: 4 }),
                y: 2918,
              },
              {
                x: add(sub(this.now, { months: 1 }), { days: 7 }),
                y: 3191,
              },
              {
                x: add(sub(this.now, { months: 1 }), { days: 10 }),
                y: 3437,
              },
              {
                x: add(sub(this.now, { months: 1 }), { days: 13 }),
                y: 3291,
              },
              {
                x: add(sub(this.now, { months: 1 }), { days: 16 }),
                y: 3317,
              },
              {
                x: add(sub(this.now, { months: 1 }), { days: 19 }),
                y: 3716,
              },
              {
                x: add(sub(this.now, { months: 1 }), { days: 22 }),
                y: 3260,
              },
              {
                x: add(sub(this.now, { months: 1 }), { days: 25 }),
                y: 3694,
              },
              {
                x: add(sub(this.now, { months: 1 }), { days: 28 }),
                y: 3598,
              },
            ],
          },
        ],
        'last-year': [
          {
            name: 'Visitors',
            data: [
              {
                x: add(sub(this.now, { months: 24 }), { days: 1 }),
                y: 2021,
              },
              {
                x: add(sub(this.now, { months: 24 }), { days: 4 }),
                y: 1749,
              },
              {
                x: add(sub(this.now, { months: 24 }), { days: 7 }),
                y: 1654,
              },
              {
                x: add(sub(this.now, { months: 24 }), { days: 10 }),
                y: 1900,
              },
              {
                x: add(sub(this.now, { months: 24 }), { days: 13 }),
                y: 1647,
              },
              {
                x: add(sub(this.now, { months: 24 }), { days: 16 }),
                y: 1315,
              },
              {
                x: add(sub(this.now, { months: 24 }), { days: 19 }),
                y: 1807,
              },
              {
                x: add(sub(this.now, { months: 24 }), { days: 22 }),
                y: 1793,
              },
              {
                x: add(sub(this.now, { months: 24 }), { days: 25 }),
                y: 1892,
              },
              {
                x: add(sub(this.now, { months: 24 }), { days: 28 }),
                y: 1846,
              },
              {
                x: add(sub(this.now, { months: 23 }), { days: 1 }),
                y: 1804,
              },
              {
                x: add(sub(this.now, { months: 23 }), { days: 4 }),
                y: 1778,
              },
              {
                x: add(sub(this.now, { months: 23 }), { days: 7 }),
                y: 2015,
              },
              {
                x: add(sub(this.now, { months: 23 }), { days: 10 }),
                y: 1892,
              },
              {
                x: add(sub(this.now, { months: 23 }), { days: 13 }),
                y: 1708,
              },
              {
                x: add(sub(this.now, { months: 23 }), { days: 16 }),
                y: 1711,
              },
              {
                x: add(sub(this.now, { months: 23 }), { days: 19 }),
                y: 1570,
              },
              {
                x: add(sub(this.now, { months: 23 }), { days: 22 }),
                y: 1507,
              },
              {
                x: add(sub(this.now, { months: 23 }), { days: 25 }),
                y: 1451,
              },
              {
                x: add(sub(this.now, { months: 23 }), { days: 28 }),
                y: 1522,
              },
              {
                x: add(sub(this.now, { months: 22 }), { days: 1 }),
                y: 1977,
              },
              {
                x: add(sub(this.now, { months: 22 }), { days: 4 }),
                y: 2367,
              },
              {
                x: add(sub(this.now, { months: 22 }), { days: 7 }),
                y: 2798,
              },
              {
                x: add(sub(this.now, { months: 22 }), { days: 10 }),
                y: 3080,
              },
              {
                x: add(sub(this.now, { months: 22 }), { days: 13 }),
                y: 2856,
              },
              {
                x: add(sub(this.now, { months: 22 }), { days: 16 }),
                y: 2745,
              },
              {
                x: add(sub(this.now, { months: 22 }), { days: 19 }),
                y: 2750,
              },
              {
                x: add(sub(this.now, { months: 22 }), { days: 22 }),
                y: 2728,
              },
              {
                x: add(sub(this.now, { months: 22 }), { days: 25 }),
                y: 2436,
              },
              {
                x: add(sub(this.now, { months: 22 }), { days: 28 }),
                y: 2289,
              },
              {
                x: add(sub(this.now, { months: 21 }), { days: 1 }),
                y: 2804,
              },
              {
                x: add(sub(this.now, { months: 21 }), { days: 4 }),
                y: 2777,
              },
              {
                x: add(sub(this.now, { months: 21 }), { days: 7 }),
                y: 3024,
              },
              {
                x: add(sub(this.now, { months: 21 }), { days: 10 }),
                y: 2657,
              },
              {
                x: add(sub(this.now, { months: 21 }), { days: 13 }),
                y: 2218,
              },
              {
                x: add(sub(this.now, { months: 21 }), { days: 16 }),
                y: 1964,
              },
              {
                x: add(sub(this.now, { months: 21 }), { days: 19 }),
                y: 1674,
              },
              {
                x: add(sub(this.now, { months: 21 }), { days: 22 }),
                y: 1721,
              },
              {
                x: add(sub(this.now, { months: 21 }), { days: 25 }),
                y: 2005,
              },
              {
                x: add(sub(this.now, { months: 21 }), { days: 28 }),
                y: 1613,
              },
              {
                x: add(sub(this.now, { months: 20 }), { days: 1 }),
                y: 1071,
              },
              {
                x: add(sub(this.now, { months: 20 }), { days: 4 }),
                y: 1079,
              },
              {
                x: add(sub(this.now, { months: 20 }), { days: 7 }),
                y: 1133,
              },
              {
                x: add(sub(this.now, { months: 20 }), { days: 10 }),
                y: 1536,
              },
              {
                x: add(sub(this.now, { months: 20 }), { days: 13 }),
                y: 2016,
              },
              {
                x: add(sub(this.now, { months: 20 }), { days: 16 }),
                y: 2256,
              },
              {
                x: add(sub(this.now, { months: 20 }), { days: 19 }),
                y: 1934,
              },
              {
                x: add(sub(this.now, { months: 20 }), { days: 22 }),
                y: 1832,
              },
              {
                x: add(sub(this.now, { months: 20 }), { days: 25 }),
                y: 2075,
              },
              {
                x: add(sub(this.now, { months: 20 }), { days: 28 }),
                y: 1709,
              },
              {
                x: add(sub(this.now, { months: 19 }), { days: 1 }),
                y: 1831,
              },
              {
                x: add(sub(this.now, { months: 19 }), { days: 4 }),
                y: 1434,
              },
              {
                x: add(sub(this.now, { months: 19 }), { days: 7 }),
                y: 1293,
              },
              {
                x: add(sub(this.now, { months: 19 }), { days: 10 }),
                y: 1064,
              },
              {
                x: add(sub(this.now, { months: 19 }), { days: 13 }),
                y: 1080,
              },
              {
                x: add(sub(this.now, { months: 19 }), { days: 16 }),
                y: 1032,
              },
              {
                x: add(sub(this.now, { months: 19 }), { days: 19 }),
                y: 1280,
              },
              {
                x: add(sub(this.now, { months: 19 }), { days: 22 }),
                y: 1344,
              },
              {
                x: add(sub(this.now, { months: 19 }), { days: 25 }),
                y: 1835,
              },
              {
                x: add(sub(this.now, { months: 19 }), { days: 28 }),
                y: 2287,
              },
              {
                x: add(sub(this.now, { months: 18 }), { days: 1 }),
                y: 2692,
              },
              {
                x: add(sub(this.now, { months: 18 }), { days: 4 }),
                y: 2250,
              },
              {
                x: add(sub(this.now, { months: 18 }), { days: 7 }),
                y: 1814,
              },
              {
                x: add(sub(this.now, { months: 18 }), { days: 10 }),
                y: 1906,
              },
              {
                x: add(sub(this.now, { months: 18 }), { days: 13 }),
                y: 1973,
              },
              {
                x: add(sub(this.now, { months: 18 }), { days: 16 }),
                y: 1882,
              },
              {
                x: add(sub(this.now, { months: 18 }), { days: 19 }),
                y: 2333,
              },
              {
                x: add(sub(this.now, { months: 18 }), { days: 22 }),
                y: 2048,
              },
              {
                x: add(sub(this.now, { months: 18 }), { days: 25 }),
                y: 2547,
              },
              {
                x: add(sub(this.now, { months: 18 }), { days: 28 }),
                y: 2884,
              },
              {
                x: add(sub(this.now, { months: 17 }), { days: 1 }),
                y: 2771,
              },
              {
                x: add(sub(this.now, { months: 17 }), { days: 4 }),
                y: 2522,
              },
              {
                x: add(sub(this.now, { months: 17 }), { days: 7 }),
                y: 2543,
              },
              {
                x: add(sub(this.now, { months: 17 }), { days: 10 }),
                y: 2413,
              },
              {
                x: add(sub(this.now, { months: 17 }), { days: 13 }),
                y: 2002,
              },
              {
                x: add(sub(this.now, { months: 17 }), { days: 16 }),
                y: 1838,
              },
              {
                x: add(sub(this.now, { months: 17 }), { days: 19 }),
                y: 1830,
              },
              {
                x: add(sub(this.now, { months: 17 }), { days: 22 }),
                y: 1872,
              },
              {
                x: add(sub(this.now, { months: 17 }), { days: 25 }),
                y: 2246,
              },
              {
                x: add(sub(this.now, { months: 17 }), { days: 28 }),
                y: 2171,
              },
              {
                x: add(sub(this.now, { months: 16 }), { days: 1 }),
                y: 2988,
              },
              {
                x: add(sub(this.now, { months: 16 }), { days: 4 }),
                y: 2694,
              },
              {
                x: add(sub(this.now, { months: 16 }), { days: 7 }),
                y: 2806,
              },
              {
                x: add(sub(this.now, { months: 16 }), { days: 10 }),
                y: 3040,
              },
              {
                x: add(sub(this.now, { months: 16 }), { days: 13 }),
                y: 2898,
              },
              {
                x: add(sub(this.now, { months: 16 }), { days: 16 }),
                y: 3013,
              },
              {
                x: add(sub(this.now, { months: 16 }), { days: 19 }),
                y: 2760,
              },
              {
                x: add(sub(this.now, { months: 16 }), { days: 22 }),
                y: 3021,
              },
              {
                x: add(sub(this.now, { months: 16 }), { days: 25 }),
                y: 2688,
              },
              {
                x: add(sub(this.now, { months: 16 }), { days: 28 }),
                y: 2572,
              },
              {
                x: add(sub(this.now, { months: 15 }), { days: 1 }),
                y: 2789,
              },
              {
                x: add(sub(this.now, { months: 15 }), { days: 4 }),
                y: 3069,
              },
              {
                x: add(sub(this.now, { months: 15 }), { days: 7 }),
                y: 3142,
              },
              {
                x: add(sub(this.now, { months: 15 }), { days: 10 }),
                y: 3614,
              },
              {
                x: add(sub(this.now, { months: 15 }), { days: 13 }),
                y: 3202,
              },
              {
                x: add(sub(this.now, { months: 15 }), { days: 16 }),
                y: 2730,
              },
              {
                x: add(sub(this.now, { months: 15 }), { days: 19 }),
                y: 2951,
              },
              {
                x: add(sub(this.now, { months: 15 }), { days: 22 }),
                y: 3267,
              },
              {
                x: add(sub(this.now, { months: 15 }), { days: 25 }),
                y: 2882,
              },
              {
                x: add(sub(this.now, { months: 15 }), { days: 28 }),
                y: 2885,
              },
              {
                x: add(sub(this.now, { months: 14 }), { days: 1 }),
                y: 2915,
              },
              {
                x: add(sub(this.now, { months: 14 }), { days: 4 }),
                y: 2790,
              },
              {
                x: add(sub(this.now, { months: 14 }), { days: 7 }),
                y: 3071,
              },
              {
                x: add(sub(this.now, { months: 14 }), { days: 10 }),
                y: 2802,
              },
              {
                x: add(sub(this.now, { months: 14 }), { days: 13 }),
                y: 2382,
              },
              {
                x: add(sub(this.now, { months: 14 }), { days: 16 }),
                y: 1883,
              },
              {
                x: add(sub(this.now, { months: 14 }), { days: 19 }),
                y: 1448,
              },
              {
                x: add(sub(this.now, { months: 14 }), { days: 22 }),
                y: 1176,
              },
              {
                x: add(sub(this.now, { months: 14 }), { days: 25 }),
                y: 1275,
              },
              {
                x: add(sub(this.now, { months: 14 }), { days: 28 }),
                y: 1136,
              },
              {
                x: add(sub(this.now, { months: 13 }), { days: 1 }),
                y: 1160,
              },
              {
                x: add(sub(this.now, { months: 13 }), { days: 4 }),
                y: 1524,
              },
              {
                x: add(sub(this.now, { months: 13 }), { days: 7 }),
                y: 1305,
              },
              {
                x: add(sub(this.now, { months: 13 }), { days: 10 }),
                y: 1725,
              },
              {
                x: add(sub(this.now, { months: 13 }), { days: 13 }),
                y: 1850,
              },
              {
                x: add(sub(this.now, { months: 13 }), { days: 16 }),
                y: 2304,
              },
              {
                x: add(sub(this.now, { months: 13 }), { days: 19 }),
                y: 2187,
              },
              {
                x: add(sub(this.now, { months: 13 }), { days: 22 }),
                y: 2597,
              },
              {
                x: add(sub(this.now, { months: 13 }), { days: 25 }),
                y: 2246,
              },
              {
                x: add(sub(this.now, { months: 13 }), { days: 28 }),
                y: 1767,
              },
            ],
          },
        ],
      },
    },
    conversions: {
      amount: 4123,
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
          name: 'Conversions',
          data: [4412, 4345, 4541, 4677, 4322, 4123],
        },
      ],
    },
    impressions: {
      amount: 46085,
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
          name: 'Impressions',
          data: [11577, 11441, 11544, 11523],
        },
      ],
    },
    visits: {
      amount: 62083,
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
          name: 'Visits',
          data: [15521, 15519, 15522, 15521],
        },
      ],
    },
    visitorsVsPageViews: {
      overallScore: 472,
      averageRatio: 45,
      predictedRatio: 55,
      series: [
        {
          name: 'Page Views',
          data: [
            {
              x: sub(this.now, { days: 65 }),
              y: 4769,
            },
            {
              x: sub(this.now, { days: 64 }),
              y: 4901,
            },
            {
              x: sub(this.now, { days: 63 }),
              y: 4640,
            },
            {
              x: sub(this.now, { days: 62 }),
              y: 5128,
            },
            {
              x: sub(this.now, { days: 61 }),
              y: 5015,
            },
            {
              x: sub(this.now, { days: 60 }),
              y: 5360,
            },
            {
              x: sub(this.now, { days: 59 }),
              y: 5608,
            },
            {
              x: sub(this.now, { days: 58 }),
              y: 5272,
            },
            {
              x: sub(this.now, { days: 57 }),
              y: 5660,
            },
            {
              x: sub(this.now, { days: 56 }),
              y: 6026,
            },
            {
              x: sub(this.now, { days: 55 }),
              y: 5836,
            },
            {
              x: sub(this.now, { days: 54 }),
              y: 5659,
            },
            {
              x: sub(this.now, { days: 53 }),
              y: 5575,
            },
            {
              x: sub(this.now, { days: 52 }),
              y: 5474,
            },
            {
              x: sub(this.now, { days: 51 }),
              y: 5427,
            },
            {
              x: sub(this.now, { days: 50 }),
              y: 5865,
            },
            {
              x: sub(this.now, { days: 49 }),
              y: 5700,
            },
            {
              x: sub(this.now, { days: 48 }),
              y: 6052,
            },
            {
              x: sub(this.now, { days: 47 }),
              y: 5760,
            },
            {
              x: sub(this.now, { days: 46 }),
              y: 5648,
            },
            {
              x: sub(this.now, { days: 45 }),
              y: 5510,
            },
            {
              x: sub(this.now, { days: 44 }),
              y: 5435,
            },
            {
              x: sub(this.now, { days: 43 }),
              y: 5239,
            },
            {
              x: sub(this.now, { days: 42 }),
              y: 5452,
            },
            {
              x: sub(this.now, { days: 41 }),
              y: 5416,
            },
            {
              x: sub(this.now, { days: 40 }),
              y: 5195,
            },
            {
              x: sub(this.now, { days: 39 }),
              y: 5119,
            },
            {
              x: sub(this.now, { days: 38 }),
              y: 4635,
            },
            {
              x: sub(this.now, { days: 37 }),
              y: 4833,
            },
            {
              x: sub(this.now, { days: 36 }),
              y: 4584,
            },
            {
              x: sub(this.now, { days: 35 }),
              y: 4822,
            },
            {
              x: sub(this.now, { days: 34 }),
              y: 4330,
            },
            {
              x: sub(this.now, { days: 33 }),
              y: 4582,
            },
            {
              x: sub(this.now, { days: 32 }),
              y: 4348,
            },
            {
              x: sub(this.now, { days: 31 }),
              y: 4132,
            },
            {
              x: sub(this.now, { days: 30 }),
              y: 4099,
            },
            {
              x: sub(this.now, { days: 29 }),
              y: 3849,
            },
            {
              x: sub(this.now, { days: 28 }),
              y: 4010,
            },
            {
              x: sub(this.now, { days: 27 }),
              y: 4486,
            },
            {
              x: sub(this.now, { days: 26 }),
              y: 4403,
            },
            {
              x: sub(this.now, { days: 25 }),
              y: 4141,
            },
            {
              x: sub(this.now, { days: 24 }),
              y: 3780,
            },
            {
              x: sub(this.now, { days: 23 }),
              y: 3929,
            },
            {
              x: sub(this.now, { days: 22 }),
              y: 3524,
            },
            {
              x: sub(this.now, { days: 21 }),
              y: 3212,
            },
            {
              x: sub(this.now, { days: 20 }),
              y: 3568,
            },
            {
              x: sub(this.now, { days: 19 }),
              y: 3800,
            },
            {
              x: sub(this.now, { days: 18 }),
              y: 3796,
            },
            {
              x: sub(this.now, { days: 17 }),
              y: 3870,
            },
            {
              x: sub(this.now, { days: 16 }),
              y: 3745,
            },
            {
              x: sub(this.now, { days: 15 }),
              y: 3751,
            },
            {
              x: sub(this.now, { days: 14 }),
              y: 3310,
            },
            {
              x: sub(this.now, { days: 13 }),
              y: 3509,
            },
            {
              x: sub(this.now, { days: 12 }),
              y: 3311,
            },
            {
              x: sub(this.now, { days: 11 }),
              y: 3187,
            },
            {
              x: sub(this.now, { days: 10 }),
              y: 2918,
            },
            {
              x: sub(this.now, { days: 9 }),
              y: 3191,
            },
            {
              x: sub(this.now, { days: 8 }),
              y: 3437,
            },
            {
              x: sub(this.now, { days: 7 }),
              y: 3291,
            },
            {
              x: sub(this.now, { days: 6 }),
              y: 3317,
            },
            {
              x: sub(this.now, { days: 5 }),
              y: 3716,
            },
            {
              x: sub(this.now, { days: 4 }),
              y: 3260,
            },
            {
              x: sub(this.now, { days: 3 }),
              y: 3694,
            },
            {
              x: sub(this.now, { days: 2 }),
              y: 3598,
            },
            {
              x: sub(this.now, { days: 1 }),
              y: 3812,
            },
          ],
        },
        {
          name: 'Visitors',
          data: [
            {
              x: sub(this.now, { days: 65 }),
              y: 1654,
            },
            {
              x: sub(this.now, { days: 64 }),
              y: 1900,
            },
            {
              x: sub(this.now, { days: 63 }),
              y: 1647,
            },
            {
              x: sub(this.now, { days: 62 }),
              y: 1315,
            },
            {
              x: sub(this.now, { days: 61 }),
              y: 1807,
            },
            {
              x: sub(this.now, { days: 60 }),
              y: 1793,
            },
            {
              x: sub(this.now, { days: 59 }),
              y: 1892,
            },
            {
              x: sub(this.now, { days: 58 }),
              y: 1846,
            },
            {
              x: sub(this.now, { days: 57 }),
              y: 1966,
            },
            {
              x: sub(this.now, { days: 56 }),
              y: 1804,
            },
            {
              x: sub(this.now, { days: 55 }),
              y: 1778,
            },
            {
              x: sub(this.now, { days: 54 }),
              y: 2015,
            },
            {
              x: sub(this.now, { days: 53 }),
              y: 1892,
            },
            {
              x: sub(this.now, { days: 52 }),
              y: 1708,
            },
            {
              x: sub(this.now, { days: 51 }),
              y: 1711,
            },
            {
              x: sub(this.now, { days: 50 }),
              y: 1570,
            },
            {
              x: sub(this.now, { days: 49 }),
              y: 1507,
            },
            {
              x: sub(this.now, { days: 48 }),
              y: 1451,
            },
            {
              x: sub(this.now, { days: 47 }),
              y: 1522,
            },
            {
              x: sub(this.now, { days: 46 }),
              y: 1801,
            },
            {
              x: sub(this.now, { days: 45 }),
              y: 1977,
            },
            {
              x: sub(this.now, { days: 44 }),
              y: 2367,
            },
            {
              x: sub(this.now, { days: 43 }),
              y: 2798,
            },
            {
              x: sub(this.now, { days: 42 }),
              y: 3080,
            },
            {
              x: sub(this.now, { days: 41 }),
              y: 2856,
            },
            {
              x: sub(this.now, { days: 40 }),
              y: 2745,
            },
            {
              x: sub(this.now, { days: 39 }),
              y: 2750,
            },
            {
              x: sub(this.now, { days: 38 }),
              y: 2728,
            },
            {
              x: sub(this.now, { days: 37 }),
              y: 2436,
            },
            {
              x: sub(this.now, { days: 36 }),
              y: 2289,
            },
            {
              x: sub(this.now, { days: 35 }),
              y: 2657,
            },
            {
              x: sub(this.now, { days: 34 }),
              y: 2804,
            },
            {
              x: sub(this.now, { days: 33 }),
              y: 2777,
            },
            {
              x: sub(this.now, { days: 32 }),
              y: 3024,
            },
            {
              x: sub(this.now, { days: 31 }),
              y: 2657,
            },
            {
              x: sub(this.now, { days: 30 }),
              y: 2218,
            },
            {
              x: sub(this.now, { days: 29 }),
              y: 1964,
            },
            {
              x: sub(this.now, { days: 28 }),
              y: 1674,
            },
            {
              x: sub(this.now, { days: 27 }),
              y: 1721,
            },
            {
              x: sub(this.now, { days: 26 }),
              y: 2005,
            },
            {
              x: sub(this.now, { days: 25 }),
              y: 1613,
            },
            {
              x: sub(this.now, { days: 24 }),
              y: 1295,
            },
            {
              x: sub(this.now, { days: 23 }),
              y: 1071,
            },
            {
              x: sub(this.now, { days: 22 }),
              y: 799,
            },
            {
              x: sub(this.now, { days: 21 }),
              y: 1133,
            },
            {
              x: sub(this.now, { days: 20 }),
              y: 1536,
            },
            {
              x: sub(this.now, { days: 19 }),
              y: 2016,
            },
            {
              x: sub(this.now, { days: 18 }),
              y: 2256,
            },
            {
              x: sub(this.now, { days: 17 }),
              y: 1934,
            },
            {
              x: sub(this.now, { days: 16 }),
              y: 1832,
            },
            {
              x: sub(this.now, { days: 15 }),
              y: 2075,
            },
            {
              x: sub(this.now, { days: 14 }),
              y: 1709,
            },
            {
              x: sub(this.now, { days: 13 }),
              y: 1932,
            },
            {
              x: sub(this.now, { days: 12 }),
              y: 1831,
            },
            {
              x: sub(this.now, { days: 11 }),
              y: 1434,
            },
            {
              x: sub(this.now, { days: 10 }),
              y: 993,
            },
            {
              x: sub(this.now, { days: 9 }),
              y: 1064,
            },
            {
              x: sub(this.now, { days: 8 }),
              y: 618,
            },
            {
              x: sub(this.now, { days: 7 }),
              y: 1032,
            },
            {
              x: sub(this.now, { days: 6 }),
              y: 1280,
            },
            {
              x: sub(this.now, { days: 5 }),
              y: 1344,
            },
            {
              x: sub(this.now, { days: 4 }),
              y: 1835,
            },
            {
              x: sub(this.now, { days: 3 }),
              y: 2287,
            },
            {
              x: sub(this.now, { days: 2 }),
              y: 2226,
            },
            {
              x: sub(this.now, { days: 1 }),
              y: 2692,
            },
          ],
        },
      ],
    },
    newVsReturning: {
      uniqueVisitors: 46085,
      series: [80, 20],
      labels: ['New', 'Returning'],
    },
    gender: {
      uniqueVisitors: 46085,
      series: [55, 45],
      labels: ['Male', 'Female'],
    },
    age: {
      uniqueVisitors: 46085,
      series: [35, 65],
      labels: ['Under 30', 'Over 30'],
    },
    language: {
      uniqueVisitors: 46085,
      series: [25, 75],
      labels: ['English', 'Other'],
    },
  };
}
