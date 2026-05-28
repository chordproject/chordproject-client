import {
  CurrencyPipe,
  DatePipe,
  I18nPluralPipe,
  NgClass,
} from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatPrefix } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Media } from '@/app/core/media';
import { Order } from '@/app/domains/admin/modules/apps/orders/data/model';
import { OrdersService } from '@/app/domains/admin/modules/apps/orders/data/orders';

@Component({
  selector: 'orders',
  imports: [
    CurrencyPipe,
    DatePipe,
    I18nPluralPipe,
    NgClass,
    MatButton,
    MatIcon,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLink,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatFormField,
    MatInput,
    MatPrefix,
    MatSortModule,
    MatTableModule,
    MatPaginator,
  ],
  host: {
    class: 'lg:h-full',
  },
  template: `
    <div
      class="@container mx-auto flex h-full w-full flex-auto flex-col overflow-hidden"
    >
      <mat-sidenav-container
        class="h-full flex-auto [&_.mat-drawer-backdrop]:fixed"
        (backdropClick)="closeOrder()"
      >
        <!-- Drawer -->
        <mat-sidenav
          class="w-full border-none bg-white sm:w-lg dark:bg-neutral-900"
          [mode]="isMobile() ? 'over' : 'side'"
          [opened]="!!selectedOrder()"
          [position]="'end'"
          [fixedInViewport]="isMobile()"
          disableClose
        >
          <router-outlet></router-outlet>
        </mat-sidenav>

        <mat-sidenav-content
          class="flex flex-auto flex-col"
          [class.border-r]="!!selectedOrder()"
        >
          <!-- Header -->
          <div
            class="flex items-center gap-x-4 border-b px-6 py-4 lg:px-8 lg:py-8"
          >
            <div class="flex flex-col gap-y-0.5">
              <div class="text-xl font-semibold tracking-tighter sm:text-2xl">
                Orders
              </div>
              <div class="text-neutral-500">
                {{
                  data.orders.length
                    | i18nPlural
                      : {
                          '=0': 'No orders',
                          '=1': '1 order',
                          other: '# orders',
                        }
                }}
              </div>
            </div>

            <!-- Spacer -->
            <div class="flex-auto"></div>

            <!-- Search -->
            <mat-form-field class="w-40 sm:w-64">
              <mat-icon
                matPrefix
                svgIcon="search"
              />
              <input
                placeholder="Search orders"
                matInput
              />
            </mat-form-field>

            <!-- Actions -->
            <button matButton="filled">
              <mat-icon svgIcon="plus" />
              Add
            </button>
          </div>

          <!-- Orders -->
          @if (data.orders && data.orders.length > 0) {
            <div class="relative flex-auto overflow-auto">
              <table
                class="-mt-px w-full border-separate border-spacing-0 whitespace-nowrap"
                mat-table
                [dataSource]="dataSource"
                [trackBy]="trackBy"
                matSort
                matSortActive="date"
                matSortDirection="desc"
              >
                <!-- Id column -->
                <ng-container matColumnDef="id">
                  <th
                    class="pl-6 lg:pl-8"
                    mat-header-cell
                    *matHeaderCellDef
                    mat-sort-header
                  >
                    Order
                  </th>
                  <td
                    class="pl-6 lg:pl-8"
                    mat-cell
                    *matCellDef="let order"
                  >
                    <span class="tabular-nums">{{ order.id }}</span>
                  </td>
                </ng-container>

                <!-- Customer column -->
                <ng-container matColumnDef="customer">
                  <th
                    mat-header-cell
                    *matHeaderCellDef
                    mat-sort-header
                  >
                    Customer
                  </th>
                  <td
                    mat-cell
                    *matCellDef="let order"
                  >
                    <div class="flex items-center">
                      @if (order.customer.avatar) {
                        <img
                          class="size-7 shrink-0 rounded-full object-cover"
                          [src]="order.customer.avatar"
                          alt="Customer avatar"
                        />
                      }
                      @if (!order.customer.avatar) {
                        <div
                          class="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 uppercase dark:bg-neutral-700 dark:text-neutral-200"
                        >
                          {{ order.customer.name.charAt(0) }}
                        </div>
                      }
                      <div class="ml-3 flex min-w-0 flex-col gap-y-1">
                        <div class="truncate leading-none font-medium">
                          {{ order.customer.name }}
                        </div>
                        <div
                          class="truncate text-sm leading-none text-neutral-500"
                        >
                          {{ order.customer.email }}
                        </div>
                      </div>
                    </div>
                  </td>
                </ng-container>

                <!-- Date column -->
                <ng-container matColumnDef="date">
                  <th
                    mat-header-cell
                    *matHeaderCellDef
                    mat-sort-header
                  >
                    Date
                  </th>
                  <td
                    mat-cell
                    *matCellDef="let order"
                  >
                    {{ order.date | date: 'mediumDate' }}
                  </td>
                </ng-container>

                <!-- Status column -->
                <ng-container matColumnDef="status">
                  <th
                    mat-header-cell
                    *matHeaderCellDef
                    mat-sort-header
                  >
                    Status
                  </th>
                  <td
                    mat-cell
                    *matCellDef="let order"
                  >
                    <span
                      class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tracking-wide uppercase"
                      [ngClass]="{
                        'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300':
                          order.status === 'pending',
                        'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300':
                          order.status === 'processing',
                        'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300':
                          order.status === 'shipped',
                        'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300':
                          order.status === 'delivered',
                        'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300':
                          order.status === 'refunded',
                      }"
                    >
                      <span class="leading-relaxed whitespace-nowrap"
                        >{{ order.status }}
                      </span>
                    </span>
                  </td>
                </ng-container>

                <!-- Items column -->
                <ng-container matColumnDef="items">
                  <th
                    mat-header-cell
                    *matHeaderCellDef
                  >
                    Items
                  </th>
                  <td
                    mat-cell
                    *matCellDef="let order"
                  >
                    <span class="tabular-nums">{{ order.items.length }}</span>
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
                    *matCellDef="let order"
                  >
                    <span class="tabular-nums">
                      {{ order.total | currency: 'USD' }}
                    </span>
                  </td>
                </ng-container>

                <!-- Header row definition -->
                <tr
                  class="bg-white dark:bg-neutral-900"
                  mat-header-row
                  *matHeaderRowDef="
                    ['id', 'customer', 'date', 'status', 'items', 'total'];
                    sticky: true
                  "
                ></tr>

                <!-- Row definition -->
                <tr
                  class="cursor-pointer hover:bg-neutral-100 dark:hover:bg-white/2.5"
                  mat-row
                  *matRowDef="
                    let order;
                    columns: [
                      'id',
                      'customer',
                      'date',
                      'status',
                      'items',
                      'total',
                    ]
                  "
                  [routerLink]="['./', order.id]"
                ></tr>
              </table>
            </div>

            <!-- Paginator -->
            <mat-paginator
              class="border-t"
              [pageSize]="25"
              [pageSizeOptions]="[10, 25, 50]"
              showFirstLastButtons
            ></mat-paginator>
          } @else {
            <div class="flex flex-auto flex-col items-center justify-center">
              <mat-icon
                class="size-12 text-neutral-500"
                svgIcon="shopping-cart"
              />
              <div class="mt-4 text-xl font-medium tracking-tight">
                No orders!
              </div>
            </div>
          }
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
})
export default class Orders {
  // Dependencies
  private media = inject(Media);
  private ordersService = inject(OrdersService);
  private router = inject(Router);

  // Queries
  readonly sort = viewChild(MatSort);
  readonly paginator = viewChild(MatPaginator);

  // State
  protected data = this.ordersService.data;
  protected dataSource = new MatTableDataSource(this.data.orders);
  protected isMobile = computed(() =>
    this.media.match(`(max-width: 1023px)`)()
  );
  selectedOrder = signal<Order | null>(null);

  constructor() {
    afterNextRender(() => {
      this.dataSource.sort = this.sort() ?? null;
      this.dataSource.paginator = this.paginator() ?? null;
    });
  }

  trackBy(_: number, item: Order) {
    return item.id;
  }

  closeOrder() {
    const selectedOrder = this.selectedOrder();
    if (selectedOrder) {
      this.selectedOrder.set(null);
      this.router.navigate(['/admin/orders']);
    }
  }
}
