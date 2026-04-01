import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexStates,
  ApexStroke,
  ApexTheme,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { Theming } from '@/app/core/theming';
import { ProjectDashboardService } from '@/app/domains/admin/modules/dashboards/data/project';
import { ProjectDashboardBudgetTable } from '@/app/domains/admin/modules/dashboards/features/project/budget-table';

@Component({
  selector: 'project-dashboard',
  imports: [
    ChartComponent,
    MatIcon,
    DatePipe,
    DecimalPipe,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatDivider,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    ProjectDashboardBudgetTable,
    MatButton,
    TranslocoPipe,
  ],
  template: `
    <div
      class="@container mx-auto flex w-full max-w-7xl flex-auto flex-col gap-4 p-6 sm:gap-6 lg:p-10 lg:pt-8"
    >
      <!-- Header -->
      <div class="flex items-center justify-between gap-x-3">
        <div class="flex flex-col gap-y-0.5">
          <div class="text-xl font-semibold tracking-tighter sm:text-2xl">
            {{ 'dashboard.project.title' | transloco }}
          </div>
          <div class="text-neutral-500">
            {{ 'dashboard.project.description' | transloco }}
          </div>
        </div>

        <!-- Spacer -->
        <div class="flex-auto"></div>

        <button matButton="filled">
          <mat-icon svgIcon="settings-2" />
          Customize
        </button>
      </div>

      <!-- Issues Overview -->
      <mat-card
        appearance="filled"
        class="flex flex-col"
      >
        <mat-card-header>
          <div class="flex flex-auto items-center gap-x-2">
            <mat-icon
              class="size-4"
              svgIcon="chart-line"
            />
            <div class="font-medium tracking-tight">Issues Overview</div>
            <div class="ml-auto">
              <button
                class="tiny"
                matIconButton
                [matMenuTriggerFor]="salesChartMenu"
              >
                <mat-icon svgIcon="ellipsis-vertical" />
              </button>
              <mat-menu #salesChartMenu="matMenu">
                <button mat-menu-item>Download chart</button>
                <button mat-menu-item>Refresh data</button>
                <mat-divider />
                <button mat-menu-item>Settings</button>
              </mat-menu>
            </div>
          </div>
        </mat-card-header>
        <div class="grid grid-cols-4 gap-1">
          <mat-card-content
            class="col-span-full flex flex-auto flex-col p-0 @2xl:col-span-2 @4xl:col-span-3"
          >
            <div class="flex items-center pt-6 pr-4 pl-6">
              <div class="flex flex-col">
                <div class="text-3xl font-semibold">New vs. Closed</div>
                <div class="mt-0.5 text-sm text-neutral-500">
                  More issues were opened than closed this week. Team needs to
                  focus on resolving existing issues.
                </div>
              </div>
            </div>
            <apx-chart
              class="h-full min-h-56 w-full flex-auto"
              [chart]="issuesChart.chart"
              [colors]="issuesChart.colors"
              [dataLabels]="issuesChart.dataLabels"
              [grid]="issuesChart.grid"
              [labels]="issuesChart.labels"
              [legend]="issuesChart.legend"
              [plotOptions]="issuesChart.plotOptions"
              [series]="issuesChart.series"
              [states]="issuesChart.states"
              [stroke]="issuesChart.stroke"
              [tooltip]="issuesChart.tooltip()"
              [xaxis]="issuesChart.xaxis"
              [yaxis]="issuesChart.yaxis"
            ></apx-chart>
          </mat-card-content>

          <mat-card-content
            class="col-span-full flex flex-col @2xl:col-span-2 @4xl:col-span-1"
          >
            <div class="mt-1">
              Distribution of closed issues by their status.
            </div>

            <div class="mt-4 flex flex-col gap-y-3">
              @for (
                item of data.issues.overview;
                track item;
                let last = $last
              ) {
                <div class="flex items-center gap-x-1">
                  <div class="text-neutral-500">
                    {{ item.label }}
                  </div>
                  <div class="flex-auto"></div>
                  <div class="font-medium tabular-nums">
                    {{ item.value }}
                  </div>
                </div>
              }
            </div>

            <div class="flex-auto"></div>

            <div class="mt-4 text-xs text-neutral-500">
              Total issue count may exceed total closed issues as some issues
              can have multiple statuses.
            </div>
          </mat-card-content>
        </div>
      </mat-card>

      <!-- Summary Stats -->
      <div
        class="grid gap-4 sm:gap-6 @max-md:grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-4"
      >
        @for (item of data.summary; track item) {
          <mat-card appearance="filled">
            <mat-card-header>
              <div class="flex items-center gap-x-2">
                <mat-icon
                  class="size-4"
                  [svgIcon]="item.icon"
                />
                <div class="font-medium tracking-tight">
                  {{ item.title }}
                </div>
              </div>
            </mat-card-header>
            <mat-card-content>
              <div class="text-5xl font-semibold">
                {{ item.value | number }}
              </div>
              <div class="mt-2 flex items-center gap-x-1">
                @if (item.change.up) {
                  <mat-icon
                    class="size-4 text-green-600"
                    svgIcon="arrow-up"
                  />
                } @else {
                  <mat-icon
                    class="size-4 text-red-600"
                    svgIcon="arrow-down"
                  />
                }
                <div
                  class="flex items-center gap-x-1 text-sm font-medium text-neutral-500"
                >
                  <div>
                    {{ item.change.value > 0 ? '+' : ''
                    }}{{ item.change.value | number }}{{ item.change.unit }}
                  </div>
                  <div>{{ item.change.period }}</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <!-- Task distribution -->
        <mat-card
          appearance="filled"
          class="flex"
        >
          <mat-card-header>
            <div class="flex flex-auto items-center gap-x-2">
              <mat-icon
                class="size-4"
                svgIcon="logs"
              />
              <div class="font-medium tracking-tight">Task Distribution</div>
              <div class="ml-auto">
                <button
                  class="tiny"
                  matIconButton
                  [matMenuTriggerFor]="taskDistributionChartMenu"
                >
                  <mat-icon svgIcon="ellipsis-vertical" />
                </button>
                <mat-menu #taskDistributionChartMenu="matMenu">
                  <button mat-menu-item>Download chart</button>
                  <button mat-menu-item>Refresh data</button>
                  <mat-divider />
                  <button mat-menu-item>Settings</button>
                </mat-menu>
              </div>
            </div>
          </mat-card-header>
          <mat-card-content class="flex flex-auto flex-col justify-center">
            <apx-chart
              class="h-80"
              [chart]="taskDistributionChart.chart"
              [grid]="taskDistributionChart.grid"
              [labels]="taskDistributionChart.labels"
              [legend]="taskDistributionChart.legend"
              [plotOptions]="taskDistributionChart.plotOptions"
              [series]="taskDistributionChart.series"
              [states]="taskDistributionChart.states"
              [stroke]="taskDistributionChart.stroke"
              [theme]="taskDistributionChart.theme()"
              [tooltip]="taskDistributionChart.tooltip()"
              [yaxis]="taskDistributionChart.yaxis"
            ></apx-chart>
          </mat-card-content>
        </mat-card>

        <!-- Upcoming schedule -->
        <mat-card appearance="filled">
          <mat-card-header>
            <div class="flex flex-auto items-center gap-x-2">
              <mat-icon
                class="size-4"
                svgIcon="calendar-clock"
              />
              <div class="font-medium tracking-tight">Upcoming Schedule</div>
              <div class="ml-auto">
                <button
                  class="tiny"
                  matIconButton
                  [matMenuTriggerFor]="upcomingScheduleMenu"
                >
                  <mat-icon svgIcon="ellipsis-vertical" />
                </button>
                <mat-menu #upcomingScheduleMenu="matMenu">
                  <button mat-menu-item>Refresh data</button>
                </mat-menu>
              </div>
            </div>
          </mat-card-header>
          <mat-card-content class="flex flex-auto flex-col gap-y-6">
            @for (item of data.schedule; track item) {
              <div class="flex items-center gap-x-4">
                <!-- Date & Time -->
                <div
                  class="flex flex-col items-center rounded-md bg-neutral-100 px-2 py-1 whitespace-nowrap dark:bg-neutral-800"
                >
                  <div class="text-xs text-neutral-500 tabular-nums">
                    {{ item.date | date: 'E, dd MMM' }}
                  </div>
                  <div class="font-medium tracking-tight tabular-nums">
                    {{ item.time }}
                  </div>
                </div>

                <div class="truncate">
                  <div class="truncate font-medium">{{ item.title }}</div>
                  @if (item.location) {
                    <div class="flex items-center">
                      <mat-icon
                        class="size-3"
                        svgIcon="map-pin"
                      ></mat-icon>
                      <div class="ml-1 truncate text-neutral-500">
                        {{ item.location }}
                      </div>
                    </div>
                  }
                </div>

                <div class="ml-auto">
                  <button matIconButton>
                    <mat-icon svgIcon="chevron-right" />
                  </button>
                </div>
              </div>
            }
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Budget -->
      <mat-card
        appearance="filled"
        class="flex flex-col"
      >
        <mat-card-header>
          <div class="flex flex-auto items-center gap-x-2">
            <mat-icon
              class="size-4"
              svgIcon="wallet"
            />
            <div class="font-medium tracking-tight">Budget</div>
            <div class="ml-auto">
              <button
                class="tiny"
                matIconButton
                [matMenuTriggerFor]="budgetMenu"
              >
                <mat-icon svgIcon="ellipsis-vertical" />
              </button>
              <mat-menu #budgetMenu="matMenu">
                <button mat-menu-item>Export as CSV</button>
                <button mat-menu-item>Export as PDF</button>
                <button mat-menu-item>Export as Excel</button>
                <mat-divider />
                <button mat-menu-item>Refresh data</button>
              </mat-menu>
            </div>
          </div>
        </mat-card-header>
        <mat-card-content class="flex flex-auto flex-col overflow-hidden p-0">
          <project-dashboard-budget-table />
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export default class ProjectDashboard {
  // Dependencies
  private projectDashboardService = inject(ProjectDashboardService);
  private theming = inject(Theming);

  // Data
  protected data = this.projectDashboardService.data;

  // Issues chart
  protected issuesChart: {
    chart: ApexChart;
    colors: string[];
    dataLabels: ApexDataLabels;
    grid: ApexGrid;
    labels: string[];
    legend: ApexLegend;
    plotOptions: ApexPlotOptions;
    series: ApexAxisChartSeries;
    states: ApexStates;
    stroke: ApexStroke;
    tooltip: Signal<ApexTooltip>;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
  } = {
    chart: {
      animations: {
        enabled: false,
      },
      fontFamily: 'inherit',
      foreColor: 'inherit',
      height: '100%',
      type: 'line',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ['var(--color-neutral-500)', 'var(--color-blue-600)'],
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0],
      background: {
        borderWidth: 0,
      },
    },
    grid: {
      borderColor:
        'light-dark(var(--color-neutral-200), var(--color-neutral-800))',
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    labels: this.data.issues.chart.labels,
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
      },
    },
    series: this.data.issues.chart.series,
    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },
      active: {
        filter: {
          type: 'none',
        },
      },
    },
    stroke: {
      curve: 'straight',
      width: [3],
    },
    tooltip: computed(() => ({
      theme: this.theming.isDark() ? 'dark' : 'light',
    })),
    xaxis: {
      axisBorder: {
        color: 'light-dark(var(--color-neutral-200), var(--color-neutral-800))',
      },
      axisTicks: {
        color: 'light-dark(var(--color-neutral-200), var(--color-neutral-800))',
      },
      labels: {
        style: {
          colors: 'var(--color-neutral-500)',
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      show: false,
    },
  };

  // Task distribution chart
  protected taskDistributionChart: {
    chart: ApexChart;
    labels: string[];
    legend: ApexLegend;
    grid: ApexGrid;
    plotOptions: ApexPlotOptions;
    series: ApexNonAxisChartSeries;
    states: ApexStates;
    stroke: ApexStroke;
    theme: Signal<ApexTheme>;
    tooltip: Signal<ApexTooltip>;
    yaxis: ApexYAxis;
  } = {
    chart: {
      animations: {
        enabled: false,
      },
      background: 'transparent',
      fontFamily: 'inherit',
      foreColor: 'inherit',
      height: '100%',
      type: 'polarArea',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    grid: {
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    labels: this.data.taskDistribution.chart.labels,
    legend: {
      show: true,
      position: 'bottom',
    },
    plotOptions: {
      polarArea: {
        rings: {
          strokeColor:
            'light-dark(var(--color-neutral-200), var(--color-neutral-800))',
        },
        spokes: {
          connectorColors:
            'light-dark(var(--color-neutral-200), var(--color-neutral-800))',
        },
      },
    },
    series: this.data.taskDistribution.chart.series,
    states: {
      hover: {
        filter: {
          type: 'darken',
        },
      },
      active: {
        filter: {
          type: 'none',
        },
      },
    },
    stroke: {
      width: 1,
    },
    theme: computed(() => ({
      mode: this.theming.isDark() ? 'dark' : 'light',
      monochrome: {
        enabled: true,
        shadeIntensity: 0.75,
        shadeTo: 'dark',
      },
    })),
    tooltip: computed(() => ({
      y: {
        formatter: (value: string | number): string => {
          return `${value}%`;
        },
      },
    })),
    yaxis: {
      labels: {
        style: {
          colors: 'var(--color-neutral-500)',
        },
      },
    },
  };
}
