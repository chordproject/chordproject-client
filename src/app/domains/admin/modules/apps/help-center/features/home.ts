import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'help-center-home',
  imports: [
    MatAccordion,
    MatCard,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatIcon,
    RouterLink,
    MatButton,
  ],
  template: `
    <div
      class="@container mx-auto flex w-full max-w-4xl flex-auto flex-col items-start p-6 pt-10 lg:p-10 lg:pt-16"
    >
      <!-- Header -->
      <div class="relative flex flex-col">
        <div class="text-xl font-bold tracking-tighter sm:text-4xl">
          Help Center
        </div>
        <div
          class="mt-2 w-full max-w-lg text-lg font-medium text-neutral-500 sm:text-xl"
        >
          We're here to help you succeed. Check out our resources below. Contact
          us if you need further assistance.
        </div>
      </div>

      <!-- Cards -->
      <div class="mt-12 grid w-full grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2">
        @for (card of cards; track card.id) {
          <mat-card
            appearance="outlined"
            class="relative isolate flex flex-col overflow-hidden hover:bg-neutral-100 dark:hover:bg-neutral-950/20"
          >
            <a
              class="absolute inset-0 z-10"
              [routerLink]="card.route"
              ><span></span
            ></a>

            <div class="flex flex-auto flex-col p-6 md:p-8">
              <div class="text-lg font-semibold tracking-tight md:text-2xl">
                {{ card.title }}
              </div>
              <div class="mt-1 text-neutral-500 md:max-w-40">
                {{ card.description }}
              </div>

              <div
                class="mt-4 flex items-center text-primary-600 md:mt-8 dark:text-primary-500"
              >
                <div class="font-semibold">{{ card.linkText }}</div>
                <mat-icon
                  class="ml-2"
                  svgIcon="move-right"
                />
              </div>
            </div>
          </mat-card>
        }
      </div>

      <!-- Guides -->
      <div
        class="mt-12 text-xl font-semibold tracking-tighter sm:mt-20 sm:text-2xl"
      >
        Guides
      </div>
      <div class="mt-2 w-full text-neutral-500">
        Step-by-step guides to help you get the most out of our application
      </div>
      <div class="mt-4 grid w-full grid-cols-1 gap-6 sm:mt-8 sm:grid-cols-3">
        @for (guide of guides; track guide.id) {
          <mat-card
            appearance="outlined"
            class="items-start p-6"
          >
            <div class="text-lg font-medium">
              {{ guide.title }}
            </div>
            <div class="mt-1 text-neutral-500">
              {{ guide.description }}
            </div>
            <a
              matButton
              class="small mt-4 -ml-3"
              [routerLink]="guide.route"
            >
              See guide
              <mat-icon
                svgIcon="move-right"
                iconPositionEnd
              />
            </a>
          </mat-card>
        }
      </div>

      <!-- Most frequently asked questions -->
      <div
        class="mt-12 text-xl font-semibold tracking-tighter sm:mt-20 sm:text-2xl"
      >
        Most frequently asked questions
      </div>
      <div class="mt-2 w-full text-neutral-500">
        Here are the most frequently asked questions you may check before
        getting started
      </div>
      <mat-accordion class="-mx-6 mt-4 max-w-4xl sm:mt-8">
        @for (faq of faqs; track faq.id) {
          <mat-expansion-panel>
            <mat-expansion-panel-header [collapsedHeight]="'56px'">
              <mat-panel-title>{{ faq.question }}</mat-panel-title>
            </mat-expansion-panel-header>
            {{ faq.answer }}
          </mat-expansion-panel>
        }
      </mat-accordion>
    </div>
  `,
})
export default class HelpCenterHome {
  protected cards = [
    {
      id: 'faq',
      title: 'FAQ',
      description: 'Frequently asked questions and answers',
      linkText: 'See all FAQs',
      route: 'faq',
    },
    {
      id: 'support',
      title: 'Support',
      description: 'Contact us for more detailed support',
      linkText: 'Contact us',
      route: 'support',
    },
  ];

  protected guides = [
    {
      id: '8z2gLFqU1U1O5PbmG42IC',
      title: 'Getting Started',
      description: 'Learn the basics to get you up and running',
      route: 'guides/getting-started',
    },
    {
      id: 'xdAcVufF4jRzvr2C42eBM',
      title: 'Projects',
      description: 'Manage and organize your projects effectively',
      route: 'guides/projects',
    },
    {
      id: 'EtnwgWwbWkHu4K1ieNiGF',
      title: 'Settings',
      description: 'Customize your preferences and configurations',
      route: 'guides/settings',
    },
    {
      id: 'z4vUH7jP7dVcEL0eYZFaT',
      title: 'Payments',
      description: 'Handle billing and subscription details',
      route: 'guides/payments',
    },
    {
      id: 'UOp9vSy1tXVLP79k6CySN',
      title: 'Your Account',
      description: 'Manage your account information and security',
      route: 'guides/your-account',
    },
  ];

  protected faqs = [
    {
      id: 'EvM9IJj8qtOMDCFGZjZPR',
      question: 'Is there a 14-days trial?',
      answer:
        'Magna consectetur culpa duis ad est tempor pariatur velit ullamco aute exercitation magna sunt commodo minim enim aliquip eiusmod ipsum adipisicing magna ipsum reprehenderit lorem magna voluptate magna aliqua culpa.\n\nSit nisi adipisicing pariatur enim enim sunt officia ad labore voluptate magna proident velit excepteur pariatur cillum sit excepteur elit veniam excepteur minim nisi cupidatat proident dolore irure veniam mollit.',
    },
    {
      id: 'p8SSUwPh0KKqEefrwQERq',
      question: 'What’s the benefits of the Premium Membership?',
      answer:
        'Et in lorem qui ipsum deserunt duis exercitation lorem elit qui qui ipsum tempor nulla velit aliquip enim consequat incididunt pariatur duis excepteur elit irure nulla ipsum dolor dolore est.\n\nAute deserunt nostrud id non ipsum do adipisicing laboris in minim officia magna elit minim mollit elit velit veniam lorem pariatur veniam sit excepteur irure commodo excepteur duis quis in.',
    },
    {
      id: 'z31WZfXjqumlf5yAAAzLB',
      question: 'How much time I will need to learn this app?',
      answer:
        'Id fugiat et cupidatat magna nulla nulla eu cillum officia nostrud dolore in veniam ullamco nulla ex duis est enim nisi aute ipsum velit et laboris est pariatur est culpa.\n\nCulpa sunt ipsum esse quis excepteur enim culpa est voluptate reprehenderit consequat duis officia irure voluptate veniam dolore fugiat dolor est amet nostrud non velit irure do voluptate id sit.',
    },
    {
      id: '5Q1odqAAcnfSip1M8nHTP',
      question: 'Are there any free tutorials available?',
      answer:
        'Excepteur deserunt tempor do lorem elit id magna pariatur irure ullamco elit dolor consectetur ad officia fugiat incididunt do elit aute esse eu voluptate adipisicing incididunt ea dolor aliqua dolor.\n\nConsequat est quis deserunt voluptate ipsum incididunt laboris occaecat irure laborum voluptate non sit labore voluptate sunt id sint ut laboris aute cupidatat occaecat eiusmod non magna aliquip deserunt nisi.',
    },
    {
      id: 'IkU6rRmB9Cjbm1I9xUxyz',
      question: 'Is there a month-to-month payment option?',
      answer:
        'Labore mollit in aliqua exercitation aliquip elit nisi nisi voluptate reprehenderit et dolor incididunt cupidatat ullamco nulla consequat voluptate adipisicing dolor qui magna sint aute do excepteur in aliqua consectetur.\n\nElit laborum non duis irure ad ullamco aliqua enim exercitation quis fugiat aute esse esse magna et ad cupidatat voluptate sint nulla nulla lorem et enim deserunt proident deserunt consectetur.',
    },
  ];
}
