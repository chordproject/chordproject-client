import { Component, ViewEncapsulation } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'invoice',
  encapsulation: ViewEncapsulation.None,
  imports: [MatButton, MatIcon],
  styles: `
    @media print {
      @page {
        size: A4;
        margin: 1.2cm;
      }
    }
  `,
  template: `
    <div
      class="mx-auto flex w-full max-w-3xl flex-auto flex-col gap-4 p-6 sm:gap-6 lg:px-8 lg:py-10 print:max-w-none print:gap-0 print:p-0"
    >
      <!-- Actions -->
      <div class="flex items-center justify-between print:hidden">
        <div class="text-xl font-semibold tracking-tighter sm:text-2xl">
          Invoice
        </div>
        <button
          matButton="filled"
          (click)="print()"
        >
          <mat-icon svgIcon="printer" />
          Print
        </button>
      </div>

      <!-- Paper -->
      <div
        class="flex flex-col gap-y-12 rounded-2xl border border-neutral-200 bg-white p-8 text-neutral-800 shadow-sm sm:p-12 print:rounded-none print:border-0 print:p-0 print:shadow-none"
      >
        <!-- Header -->
        <div class="flex items-start justify-between gap-8">
          <div class="flex flex-col gap-y-4">
            <img
              class="w-24"
              src="images/logo/logo-text.svg"
              alt="Fuse"
            />
            <div class="leading-relaxed text-sm text-neutral-500">
              Fuse Inc.<br />
              2810 Country Club Road<br />
              Cranford, NJ 07016<br />
              hello&#64;fusetheme.com
            </div>
          </div>

          <div class="flex flex-col items-end gap-y-1 text-right">
            <div class="text-3xl font-semibold tracking-tighter">Invoice</div>
            <div class="font-medium text-neutral-500">#INV-2026-0142</div>
          </div>
        </div>

        <!-- Meta -->
        <div class="flex flex-wrap justify-between gap-8">
          <div class="flex flex-col gap-y-1">
            <div class="text-sm font-medium text-neutral-400 uppercase">
              Bill to
            </div>
            <div class="font-medium">Acme Corporation</div>
            <div class="leading-relaxed text-sm text-neutral-500">
              9245 Lakeshore Boulevard<br />
              Chicago, IL 60611<br />
              accounts&#64;acme.com
            </div>
          </div>

          <div class="flex gap-x-12">
            <div class="flex flex-col gap-y-1">
              <div class="text-sm font-medium text-neutral-400 uppercase">
                Invoice date
              </div>
              <div class="font-medium">Aug 11, 2026</div>
            </div>
            <div class="flex flex-col gap-y-1">
              <div class="text-sm font-medium text-neutral-400 uppercase">
                Due date
              </div>
              <div class="font-medium">Sep 10, 2026</div>
            </div>
          </div>
        </div>

        <!-- Items -->
        <table class="w-full">
          <thead>
            <tr
              class="border-b-2 border-neutral-200 text-left text-sm font-medium text-neutral-400 uppercase"
            >
              <th class="pb-3 font-medium">Service</th>
              <th class="pb-3 text-right font-medium">Hours</th>
              <th class="pb-3 text-right font-medium">Rate</th>
              <th class="pb-3 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            @for (item of items; track item.title) {
              <tr class="border-b border-neutral-200">
                <td class="py-4 pr-4">
                  <div class="font-medium">{{ item.title }}</div>
                  <div class="text-sm text-neutral-500">
                    {{ item.description }}
                  </div>
                </td>
                <td class="py-4 text-right tabular-nums">{{ item.hours }}</td>
                <td class="py-4 text-right tabular-nums">\${{ item.rate }}</td>
                <td class="py-4 text-right font-medium tabular-nums">
                  \${{ item.amount }}
                </td>
              </tr>
            }
          </tbody>
        </table>

        <!-- Totals -->
        <div class="flex justify-end">
          <div class="flex w-full max-w-xs flex-col gap-y-2">
            <div class="flex items-center justify-between">
              <div class="text-neutral-500">Subtotal</div>
              <div class="font-medium tabular-nums">$20,800.00</div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-neutral-500">Discount (10%)</div>
              <div class="font-medium tabular-nums">-$2,080.00</div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-neutral-500">Tax (8.25%)</div>
              <div class="font-medium tabular-nums">$1,544.40</div>
            </div>
            <div
              class="mt-2 flex items-center justify-between border-t-2 border-neutral-200 pt-3"
            >
              <div class="font-medium">Total due</div>
              <div class="text-2xl font-semibold tracking-tighter tabular-nums">
                $20,264.40
              </div>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div
          class="flex flex-col gap-y-1 border-t border-neutral-200 pt-6 text-sm text-neutral-500"
        >
          <div class="font-medium text-neutral-800">Notes</div>
          <p class="leading-relaxed">
            Payment is due within 30 days of the invoice date. Please include
            the invoice number with your bank transfer. Late payments are
            subject to a 1.5% monthly service charge.
          </p>
        </div>
      </div>
    </div>
  `,
})
export default class Invoice {
  // State
  protected items = [
    {
      title: 'Product design',
      description: 'Design system audit and component library updates',
      hours: '46',
      rate: '120.00',
      amount: '5,520.00',
    },
    {
      title: 'Frontend development',
      description: 'Dashboard implementation with responsive layouts',
      hours: '92',
      rate: '110.00',
      amount: '10,120.00',
    },
    {
      title: 'API integration',
      description: 'REST endpoints, authentication and error handling',
      hours: '36',
      rate: '110.00',
      amount: '3,960.00',
    },
    {
      title: 'Quality assurance',
      description: 'Cross-browser testing and accessibility review',
      hours: '16',
      rate: '75.00',
      amount: '1,200.00',
    },
  ];

  protected print() {
    window.print();
  }
}
