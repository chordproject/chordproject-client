import { CurrencyPipe } from '@angular/common';
import { afterNextRender, Component, inject, viewChild } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  BudgetDetail,
  ProjectDashboardService,
} from '@/app/domains/admin/modules/dashboards/data/project';

@Component({
  selector: 'project-dashboard-budget-table',
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, CurrencyPipe],
  template: `
    <div class="flex flex-col">
      <div class="relative isolate overflow-x-visible overflow-y-hidden">
        <table
          class="-mt-px whitespace-nowrap"
          mat-table
          [dataSource]="dataSource"
          [trackBy]="trackBy"
          matSort
          matSortActive="date"
          matSortDirection="desc"
        >
          <!-- Type column -->
          <ng-container matColumnDef="type">
            <th
              mat-header-cell
              *matHeaderCellDef
              mat-sort-header
            >
              Type
            </th>
            <td
              mat-cell
              *matCellDef="let row"
            >
              {{ row.type }}
            </td>
          </ng-container>

          <!-- Total column -->
          <ng-container matColumnDef="total">
            <th
              mat-header-cell
              *matHeaderCellDef
              mat-sort-header
            >
              Total
            </th>
            <td
              mat-cell
              *matCellDef="let row"
            >
              <span class="tabular-nums">
                {{ row.total | currency: 'USD' }}
              </span>
            </td>
          </ng-container>

          <!-- Expenses Amount column -->
          <ng-container matColumnDef="expensesAmount">
            <th
              mat-header-cell
              *matHeaderCellDef
              mat-sort-header
            >
              Expenses (USD)
            </th>
            <td
              mat-cell
              *matCellDef="let row"
            >
              <span class="tabular-nums">
                {{ row.expensesAmount | currency: 'USD' }}
              </span>
            </td>
          </ng-container>

          <!-- Expenses Percentage column -->
          <ng-container matColumnDef="expensesPercentage">
            <th
              mat-header-cell
              *matHeaderCellDef
              mat-sort-header
            >
              Expenses (%)
            </th>
            <td
              mat-cell
              *matCellDef="let row"
            >
              <span class="tabular-nums"> {{ row.expensesPercentage }}%</span>
            </td>
          </ng-container>

          <!-- Remaining Amount column -->
          <ng-container matColumnDef="remainingAmount">
            <th
              mat-header-cell
              *matHeaderCellDef
              mat-sort-header
            >
              Remaining (USD)
            </th>
            <td
              mat-cell
              *matCellDef="let row"
            >
              <span class="tabular-nums">
                {{ row.remainingAmount | currency: 'USD' }}
              </span>
            </td>
          </ng-container>

          <!-- Remaining Percentage column -->
          <ng-container matColumnDef="remainingPercentage">
            <th
              mat-header-cell
              *matHeaderCellDef
              mat-sort-header
            >
              Remaining (%)
            </th>
            <td
              mat-cell
              *matCellDef="let row"
            >
              <span class="tabular-nums"> {{ row.remainingPercentage }}%</span>
            </td>
          </ng-container>

          <!-- Header row definition -->
          <tr
            mat-header-row
            *matHeaderRowDef="[
              'type',
              'total',
              'expensesAmount',
              'expensesPercentage',
              'remainingAmount',
              'remainingPercentage',
            ]"
          ></tr>

          <!-- Row definition -->
          <tr
            class="group hover:bg-on-surface-variant/4 relative"
            mat-row
            *matRowDef="
              let row;
              columns: [
                'type',
                'total',
                'expensesAmount',
                'expensesPercentage',
                'remainingAmount',
                'remainingPercentage',
              ]
            "
          ></tr>
        </table>
      </div>
    </div>
  `,
})
export class ProjectDashboardBudgetTable {
  // Dependencies
  protected projectDashboardService = inject(ProjectDashboardService);

  // Queries
  readonly sort = viewChild(MatSort);

  // State
  protected data = this.projectDashboardService.data;
  protected dataSource = new MatTableDataSource(this.data.budget);

  constructor() {
    afterNextRender(() => {
      this.dataSource.sort = this.sort() ?? null;
    });
  }

  trackBy(_: number, item: BudgetDetail) {
    return item.id;
  }
}
