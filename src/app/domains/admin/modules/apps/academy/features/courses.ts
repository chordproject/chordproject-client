import { PercentPipe, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AcademyService } from '@/app/domains/admin/modules/apps/academy/data/academy';

@Component({
  selector: 'academy-courses',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatButtonModule,
    RouterLink,
    PercentPipe,
    TitleCasePipe,
    MatCard,
    MatDivider,
  ],
  template: `
    <!-- Header -->
    <div class="overflow-hidden bg-linear-to-r from-blue-800 to-blue-950">
      <div
        class="@container relative mx-auto flex w-full max-w-7xl flex-auto flex-col gap-y-1 px-6 py-10 lg:px-10 lg:py-14"
      >
        <mat-icon
          class="absolute top-1/2 right-12 z-0 size-40 -translate-y-1/2 text-blue-700/60 *:[svg]:stroke-1"
          svgIcon="graduation-cap"
        />
        <div
          class="relative z-10 text-xl font-semibold tracking-tighter text-white sm:text-3xl"
        >
          What do you want to learn today?
        </div>
        <div class="relative z-10 text-md font-medium text-blue-400">
          Our courses will step you through the process of a building small
          applications, or adding new features to existing applications.
        </div>
      </div>
    </div>

    <div
      class="@container mx-auto flex w-full max-w-7xl flex-auto flex-col gap-4 p-6 sm:gap-6 lg:p-10 lg:pt-8"
    >
      <!-- Courses -->
      <div class="flex flex-auto flex-col">
        <!-- Filters -->
        <div
          class="flex w-full max-w-xs flex-col items-start justify-between sm:max-w-none sm:flex-row sm:items-center"
        >
          <mat-form-field class="w-full sm:w-36">
            <mat-select [value]="'all'">
              <mat-option [value]="'all'">All</mat-option>
              @for (category of data.categories; track category.id) {
                <mat-option [value]="category.slug">
                  {{ category.title }}
                </mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field class="mt-4 w-full sm:mt-0 sm:ml-4 sm:w-72">
            <mat-icon
              matPrefix
              svgIcon="search"
            />
            <input
              placeholder="Search by title or description"
              matInput
            />
          </mat-form-field>
          <mat-slide-toggle
            class="mt-6 sm:mt-0 sm:ml-auto"
            hideIcon
          >
            Hide completed
          </mat-slide-toggle>
        </div>

        <!-- Courses -->
        <div
          class="mt-6 grid grid-cols-1 gap-8 sm:mt-8 @lg:grid-cols-2 @4xl:grid-cols-3 @5xl:grid-cols-4"
        >
          @for (course of data.courses; track course.id) {
            <!-- Course -->
            <mat-card
              appearance="outlined"
              class="flex-col overflow-hidden"
            >
              <div class="flex flex-auto flex-col p-5">
                <div class="flex items-center justify-between">
                  <!-- Category -->
                  <div
                    class="rounded-full bg-neutral-200 px-3 py-0.5 text-sm font-semibold dark:bg-neutral-500 dark:text-black"
                  >
                    {{ course.category | titlecase }}
                  </div>

                  <!-- Completed at least once -->
                  <div class="flex items-center">
                    @if (course.progress.completed > 0) {
                      <mat-icon
                        class="size-5 text-green-600"
                        svgIcon="badge-check"
                        [matTooltip]="'You completed this course at least once'"
                      />
                    }
                  </div>
                </div>

                <!-- Title & description -->
                <div class="mt-4 text-lg font-medium">
                  {{ course.title }}
                </div>
                <div class="mt-0.5 line-clamp-2 text-neutral-500">
                  {{ course.description }}
                </div>

                <!-- Divider -->
                <div class="my-auto">
                  <mat-divider class="my-6 w-8" />
                </div>

                <!-- Duration -->
                <div class="flex items-center gap-x-2 text-neutral-500">
                  <mat-icon
                    class="text-neutral-500"
                    svgIcon="clock"
                  />
                  <div>{{ course.duration }} minutes</div>
                </div>

                <!-- Completion -->
                <div class="mt-2 flex items-center gap-x-2 text-neutral-500">
                  <mat-icon
                    class="text-neutral-500"
                    svgIcon="graduation-cap"
                  />
                  @if (course.progress.completed === 0) {
                    <div>Never completed</div>
                  } @else {
                    <div>Completed</div>
                  }
                </div>
              </div>

              <!-- Footer -->
              <div class="mt-auto flex w-full flex-col">
                <!-- Progress -->
                <div class="relative h-0.5">
                  <div
                    class="absolute inset-x-0 z-10 -mt-3 h-6"
                    [matTooltip]="
                      course.progress.currentStep / course.totalSteps | percent
                    "
                    [matTooltipPosition]="'above'"
                    [matTooltipClass]="'-mb-0.5'"
                  ></div>
                  <mat-progress-bar
                    class="h-0.5"
                    [value]="
                      (100 * course.progress.currentStep) / course.totalSteps
                    "
                  />
                </div>

                <!-- Launch button -->
                <div
                  class="flex items-center justify-end bg-neutral-50 p-3 dark:border-t dark:border-neutral-700 dark:bg-transparent"
                >
                  <a
                    mat-stroked-button
                    [routerLink]="[course.id]"
                  >
                    <span class="inline-flex items-center">
                      <!-- Not started -->
                      @if (course.progress.currentStep === 0) {
                        <!-- Never completed -->
                        @if (course.progress.completed === 0) {
                          <span>Start</span>
                        }
                        <!-- Completed before -->
                        @if (course.progress.completed > 0) {
                          <span>Start again</span>
                        }
                      }

                      <!-- Started -->
                      @if (course.progress.currentStep > 0) {
                        <span>Continue</span>
                      }

                      <mat-icon
                        class="ml-1.5 size-4"
                        svgIcon="arrow-right"
                      />
                    </span>
                  </a>
                </div>
              </div>
            </mat-card>
          }
        </div>
      </div>
    </div>
  `,
})
export default class AcademyCourses {
  // Dependencies
  private academyService = inject(AcademyService);

  // State
  protected data = this.academyService.data;
}
