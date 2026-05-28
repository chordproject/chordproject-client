import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '@/app/domains/admin/modules/apps/orders/data/orders';
import Orders from '@/app/domains/admin/modules/apps/orders/features/orders';

@Component({
  selector: 'order',
  imports: [
    CurrencyPipe,
    DatePipe,
    MatIcon,
    MatIconButton,
    MatTooltip,
    ReactiveFormsModule,
  ],
  template: `
    @let order = this.order();
    <div class="flex w-full flex-col">
      <!-- Header -->
      <div
        class="relative w-full border-b bg-neutral-100 px-8 py-8 sm:px-8 dark:bg-neutral-800"
      >
        <div class="mx-auto flex w-full max-w-3xl items-center">
          <div class="flex flex-col gap-y-0.5">
            <div class="text-2xl font-bold tabular-nums">
              {{ order.id }}
            </div>
            <div class="text-neutral-500">
              {{ order.date | date: 'longDate' }}
            </div>
          </div>

          <!-- Spacer -->
          <div class="flex-auto"></div>

          <!-- Close button -->
          <button
            matIconButton
            [matTooltip]="'Close'"
            (click)="closeOrder()"
          >
            <mat-icon svgIcon="x"></mat-icon>
          </button>
        </div>
      </div>

      <!-- Order -->
      <div class="relative flex flex-auto flex-col items-center p-6 sm:p-12">
        <div class="w-full max-w-3xl">
          <!-- Timeline -->
          <div class="flex items-center">
            @for (step of steps; track step; let i = $index; let last = $last) {
              <div class="flex flex-auto items-center last:flex-0">
                <div class="flex flex-col items-center gap-y-2">
                  <div
                    class="flex size-8 items-center justify-center rounded-full"
                    [class.bg-primary-600]="i <= currentStep()"
                    [class.text-white]="i <= currentStep()"
                    [class.bg-neutral-200]="i > currentStep()"
                    [class.text-neutral-500]="i > currentStep()"
                    [class.dark:bg-neutral-700]="i > currentStep()"
                  >
                    <mat-icon
                      class="size-4"
                      svgIcon="check"
                    />
                  </div>
                  <div class="text-sm font-medium capitalize">{{ step }}</div>
                </div>
                @if (!last) {
                  <div
                    class="mx-2 -mt-7 h-0.5 flex-auto"
                    [class.bg-primary-600]="i < currentStep()"
                    [class.bg-neutral-200]="i >= currentStep()"
                    [class.dark:bg-neutral-700]="i >= currentStep()"
                  ></div>
                }
              </div>
            }
          </div>

          <div class="mt-10 flex flex-col space-y-8">
            <!-- Customer -->
            <div class="flex items-center">
              @if (order.customer.avatar) {
                <img
                  class="size-12 shrink-0 rounded-full object-cover"
                  [src]="order.customer.avatar"
                  alt="Customer avatar"
                />
              }
              @if (!order.customer.avatar) {
                <div
                  class="flex size-12 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xl text-neutral-600 uppercase dark:bg-neutral-700 dark:text-neutral-200"
                >
                  {{ order.customer.name.charAt(0) }}
                </div>
              }
              <div class="ml-4 min-w-0">
                <div class="truncate leading-5 font-medium">
                  {{ order.customer.name }}
                </div>
                <div class="truncate leading-5 text-neutral-500">
                  {{ order.customer.email }}
                </div>
              </div>
            </div>

            <!-- Shipping address -->
            <div class="flex items-center">
              <mat-icon
                class="shrink-0"
                svgIcon="map-pin"
              />
              <div class="ml-6">
                {{ order.shippingAddress }}
              </div>
            </div>

            <!-- Payment method -->
            <div class="flex items-center">
              <mat-icon
                class="shrink-0"
                svgIcon="credit-card"
              />
              <div class="ml-6">
                {{ order.paymentMethod }}
              </div>
            </div>

            <!-- Items -->
            <div class="flex">
              <mat-icon
                class="shrink-0"
                svgIcon="package"
              />
              <div class="ml-6 flex w-full flex-col divide-y">
                @for (item of order.items; track item.name) {
                  <div class="flex items-center py-3 first:pt-0">
                    <div class="min-w-0 flex-auto truncate">
                      {{ item.name }}
                    </div>
                    <div class="ml-4 text-neutral-500 tabular-nums">
                      {{ item.quantity }} &times;
                      {{ item.price | currency: 'USD' }}
                    </div>
                    <div class="ml-6 font-medium tabular-nums">
                      {{ item.quantity * item.price | currency: 'USD' }}
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Summary -->
            <div class="flex flex-col gap-y-2 border-t pt-6">
              <div class="flex items-center">
                <div class="flex-auto text-neutral-500">Subtotal</div>
                <div class="tabular-nums">
                  {{ order.subtotal | currency: 'USD' }}
                </div>
              </div>
              <div class="flex items-center">
                <div class="flex-auto text-neutral-500">Shipping</div>
                <div class="tabular-nums">
                  {{ order.shipping | currency: 'USD' }}
                </div>
              </div>
              <div class="flex items-center">
                <div class="flex-auto text-neutral-500">Tax</div>
                <div class="tabular-nums">
                  {{ order.tax | currency: 'USD' }}
                </div>
              </div>
              <div class="flex items-center text-lg font-semibold">
                <div class="flex-auto">Total</div>
                <div class="tabular-nums">
                  {{ order.total | currency: 'USD' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class Order {
  // Dependencies
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ordersService = inject(OrdersService);
  private orders = inject(Orders);

  // Input / Output
  readonly orderId = input.required({ alias: 'id' });

  // State
  protected data = this.ordersService.data;
  protected steps = ['ordered', 'packed', 'shipped', 'delivered'];
  protected order = computed(() =>
    this.data.orders.find((order) => order.id === this.orderId())!
  );
  protected currentStep = computed(() => {
    const status = this.order().status;
    if (status === 'pending') {
      return 0;
    }
    if (status === 'processing') {
      return 1;
    }
    if (status === 'shipped') {
      return 2;
    }
    if (status === 'delivered') {
      return 3;
    }
    return -1;
  });

  constructor() {
    afterNextRender(() => {
      this.orders.selectedOrder.set(this.order());
    });
  }

  closeOrder() {
    this.orders.selectedOrder.set(null);
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
