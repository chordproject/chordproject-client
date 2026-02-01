import { CurrencyPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatOption } from '@angular/material/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import {
  MatFormField,
  MatInput,
  MatLabel,
  MatPrefix,
} from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'plan-and-billing-settings',
  imports: [
    CurrencyPipe,
    FormsModule,
    MatButton,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatPrefix,
    MatRadioButton,
    MatRadioGroup,
    MatSelect,
    FormField,
    MatCard,
    MatDivider,
  ],
  template: `
    <form
      class="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-8"
      (submit)="save($event)"
    >
      <!-- Plan section -->
      <div class="col-span-full">
        <div class="text-lg font-medium">Change your plan</div>
        <div class="text-neutral-500">
          Upgrade or downgrade your current plan.
        </div>
      </div>

      <div class="col-span-full">
        <!-- Plans -->
        <mat-radio-group
          class="pointer-events-none invisible absolute size-0 opacity-0"
          [formField]="planAndBillingSettingsForm.plan"
          #planRadioGroup="matRadioGroup"
        >
          @for (plan of plans; track plan.value) {
            <mat-radio-button [value]="plan.value"></mat-radio-button>
          }
        </mat-radio-group>
        <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
          @for (plan of plans; track plan.value) {
            <mat-card
              appearance="outlined"
              class="relative flex cursor-pointer flex-col items-start justify-start p-4"
              tabindex="0"
              [class.border-primary-600]="planRadioGroup.value === plan.value"
              [class.bg-primary-500/5]="planRadioGroup.value === plan.value"
              (pointerdown)="planRadioGroup.value = plan.value"
            >
              @if (planRadioGroup.value === plan.value) {
                <mat-icon
                  class="absolute top-3 right-3 size-6 text-primary-500"
                  svgIcon="circle-check"
                ></mat-icon>
              }
              <div class="font-semibold">{{ plan.label }}</div>
              <div class="text-neutral-500">
                {{ plan.details }}
              </div>

              <div class="mt-4 font-medium md:mt-6">
                <span>{{
                  plan.price | currency: 'USD' : 'symbol' : '1.0'
                }}</span>
                <span class="text-neutral-500"> / month</span>
              </div>
            </mat-card>
          }
        </div>
      </div>

      <!-- Divider -->
      <mat-divider class="col-span-full my-4" />

      <!-- Payment details section -->
      <div class="col-span-full">
        <div class="text-lg font-medium">Payment Details</div>
        <div class="text-neutral-500">
          Update your billing information. Make sure to set your location
          correctly as it could affect your tax rates.
        </div>
      </div>

      <!-- Card holder -->
      <mat-form-field class="col-span-full">
        <mat-label>Card holder</mat-label>
        <input
          matInput
          [formField]="planAndBillingSettingsForm.cardHolder"
        />
        <mat-icon
          svgIcon="user"
          matPrefix
        ></mat-icon>
      </mat-form-field>

      <!-- Card number -->
      <mat-form-field class="col-span-full md:col-span-2">
        <mat-label>Card number</mat-label>
        <input
          matInput
          [formField]="planAndBillingSettingsForm.cardNumber"
        />
        <mat-icon
          svgIcon="credit-card"
          matPrefix
        ></mat-icon>
      </mat-form-field>

      <!-- Card expiration -->
      <mat-form-field class="col-span-full md:col-span-1">
        <mat-label>Expiration date</mat-label>
        <input
          matInput
          [formField]="planAndBillingSettingsForm.cardExpiration"
          [placeholder]="'MM / YY'"
        />
        <mat-icon
          svgIcon="calendar"
          matPrefix
        ></mat-icon>
      </mat-form-field>

      <!-- Card CVC -->
      <mat-form-field class="col-span-full md:col-span-1">
        <mat-label>CVC</mat-label>
        <input
          matInput
          [formField]="planAndBillingSettingsForm.cardCVC"
        />
        <mat-icon
          svgIcon="lock-keyhole"
          matPrefix
        ></mat-icon>
      </mat-form-field>

      <!-- Country -->
      <mat-form-field class="col-span-full md:col-span-3">
        <mat-label>Country</mat-label>
        <mat-select [formField]="planAndBillingSettingsForm.country">
          <mat-option [value]="'usa'">United States</mat-option>
          <mat-option [value]="'canada'">Canada</mat-option>
          <mat-option [value]="'mexico'">Mexico</mat-option>
          <mat-option [value]="'france'">France</mat-option>
          <mat-option [value]="'germany'">Germany</mat-option>
          <mat-option [value]="'italy'">Italy</mat-option>
        </mat-select>
        <mat-icon
          svgIcon="map-pin"
          matPrefix
        ></mat-icon>
      </mat-form-field>

      <!-- ZIP -->
      <mat-form-field class="col-span-full md:col-span-1">
        <mat-label>ZIP / Postal code</mat-label>
        <input matInput />
        <mat-icon
          svgIcon="hash"
          matPrefix
        ></mat-icon>
      </mat-form-field>

      <!-- Divider -->
      <mat-divider class="col-span-full my-4" />

      <!-- Actions -->
      <div class="col-span-full flex items-center justify-end gap-x-4">
        <button
          type="button"
          matButton="outlined"
        >
          Cancel
        </button>
        <button matButton="filled">Save</button>
      </div>
    </form>
  `,
})
export default class PlanAndBillingSettings {
  // State
  protected planAndBillingSettingsModel = signal({
    plan: 'team',
    cardHolder: 'Brian Hughes',
    cardNumber: '',
    cardExpiration: '',
    cardCVC: '',
    country: 'usa',
    zip: '',
  });
  protected planAndBillingSettingsForm = form(this.planAndBillingSettingsModel);
  protected plans = [
    {
      value: 'basic',
      label: 'BASIC',
      details: 'Starter plan for individuals.',
      price: '10',
    },
    {
      value: 'team',
      label: 'TEAM',
      details: 'Collaborate up to 10 people.',
      price: '20',
    },
    {
      value: 'enterprise',
      label: 'ENTERPRISE',
      details: 'For bigger businesses.',
      price: '40',
    },
  ];

  save(event: Event) {
    event.preventDefault();
  }
}
