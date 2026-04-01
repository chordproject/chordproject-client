import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { afterNextRender, Component, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import {
  FinanceDashboardService,
  Transaction,
} from '@/app/domains/admin/modules/dashboards/data/finance';

@Component({
  selector: 'finance-dashboard',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    NgApexchartsModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatProgressBarModule,
    CurrencyPipe,
    DatePipe,
    MatCard,
  ],
  template: `
    <div
      class="@container mx-auto flex w-full max-w-7xl flex-auto flex-col gap-4 p-6 sm:gap-6 lg:p-10 lg:pt-8"
    >
      <!-- Header -->
      <div class="flex items-center justify-between gap-x-3">
        <div class="flex flex-col gap-y-0.5">
          <div class="text-xl font-semibold tracking-tighter sm:text-2xl">
            Finance
          </div>
          <div class="text-neutral-500">
            Overview of your financial performance including revenue, expenses,
            and profit trends.
          </div>
        </div>

        <!-- Spacer -->
        <div class="flex-auto"></div>

        <!-- Actions -->
        <div class="flex items-center gap-x-3">
          <button
            class="hidden sm:inline-flex"
            matButton="outlined"
          >
            <mat-icon svgIcon="file-chart-column" />
            Reports
          </button>
          <button
            class="hidden sm:inline-flex"
            matButton="outlined"
          >
            <mat-icon svgIcon="settings" />
            Settings
          </button>
          <button
            class="hidden sm:inline-flex"
            mat-flat-button
          >
            <mat-icon svgIcon="upload" />
            Export
          </button>

          <!-- Mobile actions menu -->
          <div class="sm:hidden">
            <button
              matIconButton
              [matMenuTriggerFor]="actionsMenu"
            >
              <mat-icon svgIcon="ellipsis" />
            </button>
            <mat-menu #actionsMenu="matMenu">
              <button mat-menu-item>Export</button>
              <button mat-menu-item>Reports</button>
              <button mat-menu-item>Settings</button>
            </mat-menu>
          </div>
        </div>
      </div>

      <div class="grid w-full grid-cols-1 gap-6 xl:grid-cols-2">
        <div class="grid gap-8 sm:grid-flow-col xl:grid-flow-row">
          <!-- Previous statement -->
          <mat-card
            class="overflow-hidden px-5 py-4"
            appearance="outlined"
          >
            <div class="absolute right-0 bottom-0 -m-6 h-24 w-24">
              <mat-icon
                class="size-24 text-green-600/25 dark:text-green-500/25"
                svgIcon="circle-check"
              />
            </div>
            <div class="flex items-center">
              <div class="flex flex-col">
                <div class="truncate text-lg font-medium tracking-tight">
                  Previous Statement
                </div>
                <div class="text-sm font-medium text-green-600">
                  Paid on {{ data.previousStatement.date }}
                </div>
              </div>
              <div class="-mt-2 ml-auto">
                <button
                  mat-icon-button
                  [matMenuTriggerFor]="previousStatementMenu"
                >
                  <mat-icon svgIcon="ellipsis" />
                </button>
                <mat-menu #previousStatementMenu="matMenu">
                  <button mat-menu-item>View statement</button>
                  <button mat-menu-item>Spending breakdown</button>
                  <button mat-menu-item>Tax breakdown</button>
                  <mat-divider />
                  <button mat-menu-item>Print statement</button>
                  <button mat-menu-item>Email statement</button>
                </mat-menu>
              </div>
            </div>
            <div class="mt-4 flex flex-row flex-wrap gap-6">
              <div class="flex flex-col">
                <div class="text-sm font-medium text-neutral-500">
                  Card Limit
                </div>
                <div class="text-3xl font-medium">
                  {{ data.previousStatement.limit | currency: 'USD' }}
                </div>
              </div>
              <div class="flex flex-col">
                <div class="text-sm font-medium text-neutral-500">Spent</div>
                <div class="text-3xl font-medium">
                  {{ data.previousStatement.spent | currency: 'USD' }}
                </div>
              </div>
              <div class="flex flex-col">
                <div class="text-sm font-medium text-neutral-500">Minimum</div>
                <div class="text-3xl font-medium">
                  {{ data.previousStatement.minimum | currency: 'USD' }}
                </div>
              </div>
            </div>
          </mat-card>

          <!-- Current statement -->
          <mat-card
            class="overflow-hidden px-5 py-4"
            appearance="outlined"
          >
            <div class="absolute right-0 bottom-0 -m-6 h-24 w-24">
              <mat-icon
                class="size-24 text-red-600/25 dark:text-red-500/25"
                svgIcon="circle-alert"
              />
            </div>
            <div class="flex items-center">
              <div class="flex flex-col">
                <div class="truncate text-lg font-medium tracking-tight">
                  Current Statement
                </div>
                <div class="text-sm font-medium text-red-600">
                  Must be paid before
                  {{ data.currentStatement.date }}
                </div>
              </div>
              <div class="-mt-2 ml-auto">
                <button
                  mat-icon-button
                  [matMenuTriggerFor]="currentStatementMenu"
                >
                  <mat-icon svgIcon="ellipsis" />
                </button>
                <mat-menu #currentStatementMenu="matMenu">
                  <button mat-menu-item>View statement</button>
                  <button mat-menu-item>Spending breakdown</button>
                  <button mat-menu-item>Tax breakdown</button>
                  <mat-divider />
                  <button mat-menu-item>Print statement</button>
                  <button mat-menu-item>Email statement</button>
                </mat-menu>
              </div>
            </div>
            <div class="mt-4 flex flex-row flex-wrap gap-6">
              <div class="flex flex-col">
                <div class="text-sm font-medium text-neutral-500">
                  Card Limit
                </div>
                <div class="text-3xl font-medium">
                  {{ data.currentStatement.limit | currency: 'USD' }}
                </div>
              </div>
              <div class="flex flex-col">
                <div class="text-sm font-medium text-neutral-500">Spent</div>
                <div class="text-3xl font-medium">
                  {{ data.currentStatement.spent | currency: 'USD' }}
                </div>
              </div>
              <div class="flex flex-col">
                <div class="text-sm font-medium text-neutral-500">Minimum</div>
                <div class="text-3xl font-medium">
                  {{ data.currentStatement.minimum | currency: 'USD' }}
                </div>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- Account balance -->
        <mat-card
          class="overflow-hidden"
          appearance="outlined"
        >
          <div class="flex flex-col px-5 py-4">
            <div class="flex flex-col">
              <div class="mr-4 truncate text-lg font-medium tracking-tight">
                Account Balance
              </div>
              <div class="font-medium text-neutral-500">
                Monthly balance growth and avg. monthly income
              </div>
            </div>

            <div class="mt-6 mr-2 flex items-start">
              <div class="flex flex-col">
                <div
                  class="text-3xl font-semibold tracking-tighter md:text-4xl"
                >
                  {{ data.accountBalance.growRate }}%
                </div>
                <div class="text-sm font-medium text-neutral-500">
                  Average Monthly Growth
                </div>
              </div>
              <div class="ml-8 flex flex-col md:ml-16">
                <div
                  class="text-3xl font-semibold tracking-tighter md:text-4xl"
                >
                  {{ data.accountBalance.ami | currency: 'USD' }}
                </div>
                <div class="text-sm font-medium text-neutral-500">
                  Average Monthly Income
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-auto flex-col">
            <apx-chart
              class="h-full w-full flex-auto"
              [chart]="accountBalanceChart.chart!"
              [colors]="accountBalanceChart.colors!"
              [fill]="accountBalanceChart.fill!"
              [series]="accountBalanceChart.series!"
              [stroke]="accountBalanceChart.stroke!"
              [tooltip]="accountBalanceChart.tooltip!"
              [xaxis]="accountBalanceChart.xaxis!"
            ></apx-chart>
          </div>
        </mat-card>
      </div>

      <div class="grid w-full grid-cols-1 gap-6">
        <!-- Recent transactions table -->
        <mat-card appearance="outlined">
          <div class="p-6">
            <div class="mr-4 truncate text-lg font-medium tracking-tight">
              Recent transactions
            </div>
            <div class="font-medium text-neutral-500">
              1 pending, 4 completed
            </div>
          </div>
          <div class="mx-6 overflow-x-auto">
            <table
              class="w-full bg-transparent"
              mat-table
              matSort
              [dataSource]="recentTransactionsDataSource"
              [trackBy]="trackBy"
              #recentTransactionsTable
            >
              <!-- Transaction ID -->
              <ng-container matColumnDef="transactionId">
                <th
                  mat-header-cell
                  mat-sort-header
                  *matHeaderCellDef
                >
                  Transaction ID
                </th>
                <td
                  mat-cell
                  *matCellDef="let transaction"
                >
                  <span
                    class="pr-6 text-sm font-medium whitespace-nowrap text-neutral-500"
                  >
                    {{ transaction.transactionId }}
                  </span>
                </td>
              </ng-container>

              <!-- Date -->
              <ng-container matColumnDef="date">
                <th
                  mat-header-cell
                  mat-sort-header
                  *matHeaderCellDef
                >
                  Date
                </th>
                <td
                  mat-cell
                  *matCellDef="let transaction"
                >
                  <span class="pr-6 whitespace-nowrap">
                    {{ transaction.date | date: 'MMM dd, y' }}
                  </span>
                </td>
              </ng-container>

              <!-- Name -->
              <ng-container matColumnDef="name">
                <th
                  mat-header-cell
                  mat-sort-header
                  *matHeaderCellDef
                >
                  Name
                </th>
                <td
                  mat-cell
                  *matCellDef="let transaction"
                >
                  <span class="pr-6 whitespace-nowrap">
                    {{ transaction.name }}
                  </span>
                </td>
              </ng-container>

              <!-- Amount -->
              <ng-container matColumnDef="amount">
                <th
                  mat-header-cell
                  mat-sort-header
                  *matHeaderCellDef
                >
                  Amount
                </th>
                <td
                  mat-cell
                  *matCellDef="let transaction"
                >
                  <span class="pr-6 font-medium whitespace-nowrap">
                    {{ transaction.amount | currency: 'USD' }}
                  </span>
                </td>
              </ng-container>

              <!-- Status -->
              <ng-container matColumnDef="status">
                <th
                  mat-header-cell
                  mat-sort-header
                  *matHeaderCellDef
                >
                  Status
                </th>
                <td
                  mat-cell
                  *matCellDef="let transaction"
                >
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase"
                    [ngClass]="{
                      'bg-red-200 text-red-800 dark:bg-red-600 dark:text-red-50':
                        transaction.status === 'pending',
                      'bg-green-200 text-green-800 dark:bg-green-600 dark:text-green-50':
                        transaction.status === 'completed',
                    }"
                  >
                    <span class="leading-relaxed whitespace-nowrap"
                      >{{ transaction.status }}
                    </span>
                  </span>
                </td>
              </ng-container>

              <!-- Footer -->
              <ng-container matColumnDef="recentOrdersTableFooter">
                <td
                  class="border-0 px-0 py-6"
                  mat-footer-cell
                  *matFooterCellDef
                  colspan="6"
                >
                  <button mat-stroked-button>See all transactions</button>
                </td>
              </ng-container>

              <tr
                mat-header-row
                *matHeaderRowDef="recentTransactionsTableColumns"
              ></tr>
              <tr
                class="order-row h-16"
                mat-row
                *matRowDef="let row; columns: recentTransactionsTableColumns"
              ></tr>
              <tr
                class="h-16 border-0"
                mat-footer-row
                *matFooterRowDef="['recentOrdersTableFooter']"
              ></tr>
            </table>
          </div>
        </mat-card>

        <!-- Budget -->
        <mat-card
          class="p-6"
          appearance="outlined"
        >
          <div class="flex items-center">
            <div class="flex flex-col">
              <div class="mr-4 truncate text-lg font-medium tracking-tight">
                Budget
              </div>
              <div class="font-medium text-neutral-500">
                Monthly budget summary
              </div>
            </div>
            <div class="-mt-2 -mr-2 ml-auto">
              <button
                mat-icon-button
                [matMenuTriggerFor]="budgetMenu"
              >
                <mat-icon svgIcon="ellipsis" />
              </button>
              <mat-menu #budgetMenu="matMenu">
                <button mat-menu-item>Expenses breakdown</button>
                <button mat-menu-item>Savings breakdown</button>
                <button mat-menu-item>Bills breakdown</button>
                <mat-divider />
                <button mat-menu-item>Print budget summary</button>
                <button mat-menu-item>Email budget summary</button>
              </mat-menu>
            </div>
          </div>
          <div class="mt-6 text-sm">
            Last month you had <strong>223</strong> expense transactions,
            <strong>12</strong> savings entries and <strong>4</strong> bills.
          </div>
          <div class="my-8 space-y-8">
            <div class="flex flex-col">
              <div class="flex items-center">
                <div
                  class="flex h-14 w-14 items-center justify-center rounded-lg bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50"
                >
                  <mat-icon
                    class="size-6"
                    svgIcon="credit-card"
                  />
                </div>
                <div class="ml-4 flex-auto">
                  <div class="text-sm font-medium text-neutral-500">
                    Expenses
                  </div>
                  <div class="text-2xl font-medium">
                    {{ data.budget.expenses | currency: 'USD' }}
                  </div>
                  <mat-progress-bar
                    class="mt-2 rounded-full"
                    [color]="'error'"
                    [mode]="'determinate'"
                    [value]="
                      (data.budget.expenses * 100) / data.budget.expensesLimit
                    "
                  ></mat-progress-bar>
                </div>
                <div class="mt-auto ml-6 flex min-w-18 items-end justify-end">
                  <div class="font-medium">2.6%</div>
                  <mat-icon
                    class="ml-1 size-5 text-green-600"
                    svgIcon="arrow-down"
                  />
                </div>
              </div>
            </div>

            <div class="flex flex-col">
              <div class="flex items-center">
                <div
                  class="flex h-14 w-14 items-center justify-center rounded-lg bg-indigo-100 text-indigo-800 dark:bg-indigo-600 dark:text-indigo-50"
                >
                  <mat-icon
                    class="size-6 text-current"
                    svgIcon="banknote"
                  />
                </div>
                <div class="ml-4 flex-auto">
                  <div class="text-sm font-medium text-neutral-500">
                    Savings
                  </div>
                  <div class="text-2xl font-medium">
                    {{ data.budget.savings | currency: 'USD' }}
                  </div>
                  <mat-progress-bar
                    class="mt-2 rounded-full"
                    [mode]="'determinate'"
                    [value]="
                      (data.budget.savings * 100) / data.budget.savingsGoal
                    "
                  ></mat-progress-bar>
                </div>
                <div class="mt-auto ml-6 flex min-w-18 items-end justify-end">
                  <div class="font-medium">12.7%</div>
                  <mat-icon
                    class="ml-1 size-5 text-red-600"
                    svgIcon="arrow-up"
                  />
                </div>
              </div>
            </div>

            <div class="flex flex-col">
              <div class="flex items-center">
                <div
                  class="flex h-14 w-14 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-600 dark:text-teal-50"
                >
                  <mat-icon
                    class="size-6 text-current"
                    svgIcon="plug"
                  />
                </div>
                <div class="ml-4 flex-auto leading-none">
                  <div class="text-sm font-medium text-neutral-500">Bills</div>
                  <div class="text-2xl font-medium">
                    {{ data.budget.bills | currency: 'USD' }}
                  </div>
                  <mat-progress-bar
                    class="mt-2 rounded-full"
                    [mode]="'determinate'"
                    [value]="(data.budget.bills * 100) / data.budget.billsLimit"
                  ></mat-progress-bar>
                </div>
                <div class="mt-auto ml-6 flex min-w-18 items-end justify-end">
                  <div class="font-medium">105.7%</div>
                  <mat-icon
                    class="ml-1 size-5 text-red-600"
                    svgIcon="arrow-up"
                  />
                </div>
              </div>
              <div class="mt-3 text-neutral-500">
                Exceeded your personal limit! Be careful next month.
              </div>
            </div>
          </div>
          <div class="mt-auto flex items-center">
            <button
              class="mt-2"
              mat-stroked-button
            >
              Download Summary
            </button>
          </div>
        </mat-card>
      </div>
    </div>
  `,
})
export default class FinanceDashboard {
  // Dependencies
  private financeDashboardService = inject(FinanceDashboardService);

  // Queries
  readonly sort = viewChild(MatSort);

  // State
  protected data = this.financeDashboardService.data;
  protected recentTransactionsDataSource = new MatTableDataSource(
    this.data.recentTransactions
  );
  protected recentTransactionsTableColumns: string[] = [
    'transactionId',
    'date',
    'name',
    'amount',
    'status',
  ];
  protected accountBalanceChart: ApexOptions = {
    chart: {
      animations: {
        speed: 400,
        animateGradually: {
          enabled: false,
        },
      },
      fontFamily: 'inherit',
      foreColor: 'inherit',
      width: '100%',
      height: '100%',
      type: 'area',
      offsetY: 1,
      sparkline: {
        enabled: true,
      },
    },
    colors: ['var(--color-neutral-600)', 'var(--color-neutral-500)'],
    fill: {
      colors: [
        'light-dark(var(--color-neutral-200), var(--color-neutral-800))',
        'light-dark(var(--color-neutral-100), var(--color-neutral-700))',
      ],
      opacity: 0.2,
      type: 'solid',
    },
    series: this.data.accountBalance.series,
    stroke: {
      curve: 'straight',
      width: 2,
    },
    tooltip: {
      followCursor: true,
      theme: 'dark',
      x: {
        format: 'MMM dd, yyyy',
      },
      y: {
        formatter: (value): string => value + '%',
      },
    },
    xaxis: {
      type: 'datetime',
    },
  };

  constructor() {
    afterNextRender(() => {
      this.recentTransactionsDataSource.sort = this.sort() ?? null;
    });
  }

  trackBy(_: number, item: Transaction) {
    return item.id;
  }
}
