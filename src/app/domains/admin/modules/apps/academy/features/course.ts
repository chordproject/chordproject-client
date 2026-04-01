import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { Media } from '@/app/core/media';
import { AcademyService } from '@/app/domains/admin/modules/apps/academy/data/academy';

@Component({
  selector: 'academy-course',
  imports: [
    MatSidenavModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTabsModule,
    TitleCasePipe,
    Tabs,
    TabList,
    TabPanel,
    Tab,
    TabContent,
  ],
  host: {
    class: 'lg:h-[calc(1dvh-57px)]',
  },
  template: `
    @let course = this.course();
    @let currentStep = this.currentStep();

    <mat-sidenav-container class="[&_.mat-drawer-backdrop]:fixed">
      <!-- Drawer -->
      <mat-sidenav
        class="w-90 bg-white dark:bg-neutral-900"
        [autoFocus]="false"
        [mode]="isMobile() ? 'over' : 'side'"
        [opened]="!isMobile()"
        [fixedInViewport]="isMobile()"
        #drawer
      >
        <div class="flex flex-col">
          <div class="flex flex-col items-start border-b p-6">
            <!-- Back to courses -->
            <a
              class="-ml-2"
              matButton
              [routerLink]="['..']"
            >
              <mat-icon
                class="text-current"
                svgIcon="arrow-left"
              />
              Back to courses
            </a>

            <!-- Category -->
            <div
              class="mt-4 rounded-full bg-neutral-200 px-3 py-0.5 text-sm font-semibold dark:bg-neutral-500 dark:text-black"
            >
              {{ course.category | titlecase }}
            </div>

            <!-- Title & description -->
            <div class="mt-4 text-2xl font-semibold">
              {{ course.title }}
            </div>
            <div class="mt-1 text-neutral-500">{{ course.description }}</div>
          </div>

          <!-- Steps -->
          <div class="px-6 py-2">
            <ol>
              @for (step of course.steps; track step.order; let last = $last) {
                <li
                  class="group relative py-6 select-none"
                  [class.current-step]="step.order === currentStep"
                >
                  @if (!last) {
                    <div
                      class="absolute top-6 left-4 -ml-px h-full w-0.5"
                      [class.bg-primary-600]="step.order < currentStep"
                      [class.dark:bg-primary-500]="step.order < currentStep"
                      [class.bg-neutral-300]="step.order >= currentStep"
                      [class.dark:bg-neutral-600]="step.order >= currentStep"
                    ></div>
                  }
                  <button
                    class="relative flex cursor-pointer items-start text-left"
                    (click)="goToStep(step.order)"
                  >
                    <div
                      class="flex size-8 shrink-0 items-center justify-center rounded-full ring-2 ring-inset"
                      [class.text-white]="step.order < currentStep"
                      [class.ring-transparent]="step.order < currentStep"
                      [class.bg-primary-600]="step.order < currentStep"
                      [class.dark:bg-primary-500]="step.order < currentStep"
                      [class.ring-primary-600]="step.order === currentStep"
                      [class.bg-white]="step.order >= currentStep"
                      [class.dark:bg-neutral-900]="step.order >= currentStep"
                      [class.ring-neutral-300]="step.order >= currentStep"
                      [class.dark:ring-neutral-600]="step.order >= currentStep"
                    >
                      <!-- Check icon, show if the step is completed -->
                      @if (step.order < currentStep) {
                        <mat-icon
                          class="text-current"
                          svgIcon="check"
                        />
                      }
                      <!-- Step order, show if the step is the current step -->
                      @if (step.order === currentStep) {
                        <div
                          class="font-semibold text-primary-600 dark:text-white"
                        >
                          {{ step.order + 1 }}
                        </div>
                      }
                      <!-- Step order, show if the step is not completed -->
                      @if (step.order > currentStep) {
                        <div
                          class="font-semibold text-neutral-500 group-hover:text-neutral-500"
                        >
                          {{ step.order + 1 }}
                        </div>
                      }
                    </div>
                    <div class="ml-4 flex flex-col gap-y-1">
                      <div class="font-medium">{{ step.title }}</div>
                      <div class="text-sm text-neutral-500">
                        {{ step.subtitle }}
                      </div>
                    </div>
                  </button>
                </li>
              }
            </ol>
          </div>
        </div>
      </mat-sidenav>

      <!-- Drawer content -->
      <mat-sidenav-content class="flex flex-col border-l">
        <!-- Header -->
        <div
          class="flex flex-0 items-center border-b py-2 pr-6 pl-4 sm:py-4 md:pr-8 md:pl-6 lg:hidden lg:border-b-0 dark:bg-transparent"
        >
          <!-- Title & Actions -->
          <a
            mat-icon-button
            [routerLink]="['..']"
          >
            <mat-icon svgIcon="move-left" />
          </a>
          <h2 class="ml-2.5 truncate font-medium tracking-tight sm:text-xl">
            {{ course.title }}
          </h2>
        </div>
        <mat-progress-bar
          class="hidden h-0.5 w-full flex-0 lg:block"
          [value]="(100 * (currentStep + 1)) / course.totalSteps"
        />

        <!-- Steps -->
        <div
          ngTabs
          class="flex flex-col items-center"
          #tabs
        >
          <div
            ngTabList
            [selectedTab]="currentStep.toString()"
            class="hidden size-0 opacity-0"
          >
            @for (step of course.steps; track step.order) {
              <div
                ngTab
                [value]="step.order.toString()"
              ></div>
            }
          </div>

          @for (step of course.steps; track step.order) {
            <div
              ngTabPanel
              [value]="step.order.toString()"
            >
              <ng-template ngTabContent>
                <div
                  class="mx-auto prose max-w-3xl px-4 pb-20 sm:px-6 lg:pb-0"
                  [innerHTML]="step.content"
                ></div>
              </ng-template>
            </div>
          }
        </div>

        <!-- Navigation - Desktop -->
        <div
          class="sticky bottom-0 z-10 hidden border-t bg-white/60 p-4 backdrop-blur-sm lg:flex dark:bg-black/10"
        >
          <div
            class="mx-auto flex items-center justify-center gap-x-3 rounded-xl bg-primary-600 p-2 shadow-lg"
          >
            <button
              matButton="filled"
              (click)="goToPreviousStep()"
            >
              <mat-icon svgIcon="move-left" />
              Prev
            </button>
            <div
              class="flex items-center justify-center gap-x-0.5 font-medium text-primary-50"
            >
              <span>{{ currentStep + 1 }}</span>
              <span class="text-primary-300">/</span>
              <span>{{ course.totalSteps }}</span>
            </div>
            <button
              matButton="filled"
              (click)="goToNextStep()"
            >
              <mat-icon
                iconPositionEnd
                svgIcon="move-right"
              />
              Next
            </button>
          </div>
        </div>

        <!-- Progress & Navigation - Mobile -->
        <div
          class="fixed bottom-0 z-10 flex w-full items-center border-t bg-white p-4 lg:hidden dark:bg-neutral-900"
        >
          <button
            mat-icon-button
            (click)="drawer.toggle()"
          >
            <mat-icon svgIcon="menu" />
          </button>
          <div
            class="ml-1 flex items-center justify-center leading-5 font-medium lg:ml-2"
          >
            <span>{{ currentStep + 1 }}</span>
            <span class="mx-0.5 text-neutral-500">/</span>
            <span>{{ course.totalSteps }}</span>
          </div>
          <mat-progress-bar
            class="ml-6 flex-auto rounded-full"
            [value]="(100 * (currentStep + 1)) / course.totalSteps"
          ></mat-progress-bar>
          <button
            class="ml-4"
            mat-icon-button
            (click)="goToPreviousStep()"
          >
            <mat-icon svgIcon="arrow-left" />
          </button>
          <button
            class="ml-0.5"
            mat-icon-button
            (click)="goToNextStep()"
          >
            <mat-icon svgIcon="arrow-right" />
          </button>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
})
export default class AcademyCourse {
  // Dependencies
  private academyService = inject(AcademyService);
  private media = inject(Media);

  // Inputs / Outputs
  readonly courseId = input.required({ alias: 'id' });

  // State
  protected data = this.academyService.data;
  protected course = computed(
    () => this.data.courses.find((course) => course.id === this.courseId())!
  );
  protected currentStep = signal(0);
  protected isMobile = computed(() =>
    this.media.match(`(max-width: 1023px)`)()
  );

  goToStep(step: number): void {
    // Go to the step
    this.currentStep.set(step);
  }

  goToPreviousStep(): void {
    // Return if we already on the first step
    if (this.currentStep() === 0) {
      return;
    }

    // Go to previous
    this.currentStep.update((value) => value - 1);
  }

  goToNextStep(): void {
    // Return if we already on the last step
    if (this.currentStep() === this.course().totalSteps - 1) {
      return;
    }

    // Go to next step
    this.currentStep.update((value) => value + 1);
  }
}
