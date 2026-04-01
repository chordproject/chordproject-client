import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCard } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexStates,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { Theming } from '@/app/core/theming';
import { AnalyticsDashboardService } from '@/app/domains/admin/modules/dashboards/data/analytics';

@Component({
  selector: 'analytics-dashboard',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatTooltipModule,
    DecimalPipe,
    MatCard,
    MatDivider,
    ChartComponent,
  ],
  template: `
    <div
      class="@container mx-auto flex w-full max-w-7xl flex-auto flex-col gap-4 p-6 sm:gap-6 lg:p-10 lg:pt-8"
    >
      <!-- Header -->
      <div class="flex items-center justify-between gap-x-3">
        <div class="flex flex-col gap-y-0.5">
          <div class="text-xl font-semibold tracking-tighter sm:text-2xl">
            Overview
          </div>
          <div class="text-neutral-500">
            A quick glance at the most important metrics and trends related to
            your website visitors.
          </div>
        </div>

        <!-- Spacer -->
        <div class="flex-auto"></div>

        <button matButton="outlined">
          <mat-icon svgIcon="upload" />
          Export
        </button>
      </div>

      <!-- Visitors -->
      <mat-card
        class="overflow-hidden"
        appearance="outlined"
      >
        <div class="flex items-center justify-between gap-x-4 p-6 pb-0">
          <div class="text-xl font-semibold sm:text-2xl">Visitors</div>

          <mat-button-toggle-group
            value="this-year"
            #visitorsYearSelector="matButtonToggleGroup"
          >
            <mat-button-toggle value="last-year">Last Year</mat-button-toggle>
            <mat-button-toggle value="this-year">This Year</mat-button-toggle>
          </mat-button-toggle-group>
        </div>

        <div class="flex flex-auto flex-col">
          <apx-chart
            class="h-80"
            [chart]="visitorsChart.chart"
            [colors]="visitorsChart.colors"
            [dataLabels]="visitorsChart.dataLabels"
            [fill]="visitorsChart.fill"
            [grid]="visitorsChart.grid"
            [series]="visitorsChart.series[visitorsYearSelector.value]"
            [stroke]="visitorsChart.stroke"
            [tooltip]="visitorsChart.tooltip()"
            [xaxis]="visitorsChart.xaxis"
            [yaxis]="visitorsChart.yaxis"
          ></apx-chart>
        </div>
      </mat-card>

      <div class="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Conversions -->
        <mat-card
          class="overflow-hidden"
          appearance="outlined"
        >
          <div class="flex flex-col gap-y-2 p-6 pb-0">
            <div class="truncate text-lg font-medium tracking-tight">
              Conversions
            </div>

            <div class="text-4xl font-semibold">
              {{ data.conversions.amount | number: '1.0-0' }}
            </div>
            <div class="flex items-center gap-x-1">
              <mat-icon
                class="text-red-600"
                svgIcon="trending-down"
              />
              <div class="font-medium text-red-600">2%</div>
              <div class="text-neutral-500">below target</div>
            </div>
          </div>

          <div class="flex flex-auto flex-col">
            <apx-chart
              class="h-20"
              [chart]="conversionsChart.chart"
              [colors]="conversionsChart.colors"
              [fill]="conversionsChart.fill"
              [series]="conversionsChart.series"
              [stroke]="conversionsChart.stroke"
              [tooltip]="conversionsChart.tooltip"
            ></apx-chart>
          </div>
        </mat-card>

        <!-- Impressions -->
        <mat-card
          class="overflow-hidden"
          appearance="outlined"
        >
          <div class="flex flex-col gap-y-2 p-6 pb-0">
            <div class="truncate text-lg font-medium tracking-tight">
              Impressions
            </div>

            <div class="text-4xl font-semibold">
              {{ data.impressions.amount | number: '1.0-0' }}
            </div>
            <div class="flex items-center gap-x-1">
              <mat-icon
                class="text-red-600"
                svgIcon="trending-down"
              />
              <div class="font-medium text-red-600">2%</div>
              <div class="text-neutral-500">below target</div>
            </div>
          </div>

          <div class="flex flex-auto flex-col">
            <apx-chart
              class="h-20"
              [chart]="impressionsChart.chart"
              [colors]="impressionsChart.colors"
              [fill]="impressionsChart.fill"
              [series]="impressionsChart.series"
              [stroke]="impressionsChart.stroke"
              [tooltip]="impressionsChart.tooltip"
            ></apx-chart>
          </div>
        </mat-card>

        <!-- Visits -->
        <mat-card
          class="overflow-hidden"
          appearance="outlined"
        >
          <div class="flex flex-col gap-y-2 p-6 pb-0">
            <div class="truncate text-lg font-medium tracking-tight">
              Visits
            </div>

            <div class="text-4xl font-semibold">
              {{ data.visits.amount | number: '1.0-0' }}
            </div>
            <div class="flex items-center gap-x-1">
              <mat-icon
                class="text-green-600"
                svgIcon="trending-up"
              />
              <div class="font-medium text-green-600">3%</div>
              <div class="text-neutral-500">above target</div>
            </div>
          </div>

          <div class="flex flex-auto flex-col">
            <apx-chart
              class="h-20"
              [chart]="visitsChart.chart"
              [colors]="visitsChart.colors"
              [fill]="visitsChart.fill"
              [series]="visitsChart.series"
              [stroke]="visitsChart.stroke"
              [tooltip]="visitsChart.tooltip"
            ></apx-chart>
          </div>
        </mat-card>
      </div>

      <!-- Section title -->
      <div class="mt-12 w-full">
        <div class="text-xl font-semibold tracking-tighter sm:text-2xl">
          Your Audience
        </div>
        <div class="text-neutral-500">
          Demographic properties of your users and how they interact with your
          content.
        </div>
      </div>

      <!-- Visitors vs. Page Views -->
      <mat-card
        class="overflow-hidden"
        appearance="outlined"
      >
        <div class="flex flex-col items-start justify-between gap-y-4 p-6 pb-0">
          <div class="truncate text-lg leading-6 font-medium tracking-tight">
            Visitors vs. Page Views
          </div>

          <div class="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-12">
            <div class="flex flex-col">
              <div class="flex items-center">
                <div class="leading-5 font-medium text-neutral-500">
                  Overall Score
                </div>
                <mat-icon
                  class="ml-1.5 size-4 text-neutral-500"
                  svgIcon="info"
                  [matTooltip]="'Score is calculated by using the historical ratio between Page Views and Visitors. Best score is 1000, worst score is 0.'"
                />
              </div>
              <div class="mt-2 flex items-end gap-x-2">
                <div class="text-4xl leading-none font-bold tracking-tight">
                  {{ data.visitorsVsPageViews.overallScore }}
                </div>
                <div class="flex items-center gap-x-1">
                  <mat-icon
                    class="text-green-600"
                    svgIcon="arrow-up"
                  />
                  <div class="font-medium text-green-600">42.9%</div>
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <div class="flex items-center">
                <div class="leading-5 font-medium text-neutral-500">
                  Average Ratio
                </div>
                <mat-icon
                  class="ml-1.5 size-4 text-neutral-500"
                  svgIcon="info"
                  [matTooltip]="'Average Ratio is the average ratio between Page Views and Visitors'"
                />
              </div>
              <div class="mt-2 flex items-end gap-x-2">
                <div class="text-4xl leading-none font-bold tracking-tight">
                  {{ data.visitorsVsPageViews.averageRatio | number: '1.0-0' }}%
                </div>
                <div class="flex items-center gap-x-1">
                  <mat-icon
                    class="text-red-600"
                    svgIcon="arrow-down"
                  />
                  <div class="font-medium text-red-600">13.1%</div>
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <div class="flex items-center">
                <div class="leading-5 font-medium text-neutral-500">
                  Predicted Ratio
                </div>
                <mat-icon
                  class="ml-1.5 size-4 text-neutral-500"
                  svgIcon="info"
                  [matTooltip]="'Predicted Ratio is calculated by using historical ratio, current trends and your goal targets.'"
                />
              </div>
              <div class="mt-2 flex items-end gap-x-2">
                <div class="text-4xl leading-none font-bold tracking-tight">
                  {{
                    data.visitorsVsPageViews.predictedRatio | number: '1.0-0'
                  }}%
                </div>
                <div class="flex items-center gap-x-1">
                  <mat-icon
                    class="text-green-600"
                    svgIcon="arrow-up"
                  />
                  <div class="font-medium text-green-600">22.2%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-auto flex-col">
          <apx-chart
            class="h-80"
            [chart]="visitorsVsPageViewsChart.chart"
            [colors]="visitorsVsPageViewsChart.colors"
            [dataLabels]="visitorsVsPageViewsChart.dataLabels"
            [grid]="visitorsVsPageViewsChart.grid"
            [legend]="visitorsVsPageViewsChart.legend"
            [series]="visitorsVsPageViewsChart.series"
            [stroke]="visitorsVsPageViewsChart.stroke"
            [tooltip]="visitorsVsPageViewsChart.tooltip()"
            [xaxis]="visitorsVsPageViewsChart.xaxis"
            [yaxis]="visitorsVsPageViewsChart.yaxis"
          ></apx-chart>
        </div>
      </mat-card>

      <div
        class="mt-6 grid w-full grid-cols-1 gap-8 sm:grid-cols-2 md:mt-8 lg:grid-cols-4"
      >
        <!-- New vs. Returning -->
        <mat-card
          class="p-6"
          appearance="outlined"
        >
          <div class="truncate text-lg font-medium tracking-tighter">
            New vs. Returning
          </div>

          <div class="mt-6 flex flex-auto flex-col items-center">
            <apx-chart
              class="h-44"
              [chart]="newVsReturningChart.chart"
              [colors]="newVsReturningChart.colors"
              [labels]="newVsReturningChart.labels"
              [plotOptions]="newVsReturningChart.plotOptions"
              [series]="newVsReturningChart.series"
              [states]="newVsReturningChart.states"
              [tooltip]="newVsReturningChart.tooltip()"
            ></apx-chart>
          </div>
          <div class="mt-8 grid grid-cols-2">
            @for (
              dataset of data.newVsReturning.series;
              track dataset;
              let i = $index;
              let last = $last
            ) {
              <div class="truncate">
                {{ data.newVsReturning.labels[i] }}
              </div>
              <div class="text-right font-medium">
                {{
                  (data.newVsReturning.uniqueVisitors * dataset) / 100
                    | number: '1.0-0'
                }}
              </div>

              @if (!last) {
                <mat-divider class="col-span-full my-2" />
              }
            }
          </div>
        </mat-card>

        <!-- Gender -->
        <mat-card
          class="p-6"
          appearance="outlined"
        >
          <div class="truncate text-lg font-medium tracking-tighter">
            Gender
          </div>

          <div class="mt-6 flex flex-auto flex-col items-center">
            <apx-chart
              class="h-44"
              [chart]="genderChart.chart"
              [colors]="genderChart.colors"
              [labels]="genderChart.labels"
              [plotOptions]="genderChart.plotOptions"
              [series]="genderChart.series"
              [states]="genderChart.states"
              [tooltip]="genderChart.tooltip()"
            ></apx-chart>
          </div>
          <div class="mt-8 grid grid-cols-2">
            @for (
              dataset of data.gender.series;
              track dataset;
              let i = $index;
              let last = $last
            ) {
              <div class="truncate">
                {{ data.gender.labels[i] }}
              </div>
              <div class="text-right font-medium">
                {{
                  (data.gender.uniqueVisitors * dataset) / 100 | number: '1.0-0'
                }}
              </div>

              @if (!last) {
                <mat-divider class="col-span-full my-2" />
              }
            }
          </div>
        </mat-card>

        <!-- Age -->
        <mat-card
          class="p-6"
          appearance="outlined"
        >
          <div class="truncate text-lg font-medium tracking-tighter">Age</div>

          <div class="mt-6 flex flex-auto flex-col items-center">
            <apx-chart
              class="h-44"
              [chart]="ageChart.chart"
              [colors]="ageChart.colors"
              [labels]="ageChart.labels"
              [plotOptions]="ageChart.plotOptions"
              [series]="ageChart.series"
              [states]="ageChart.states"
              [tooltip]="ageChart.tooltip()"
            ></apx-chart>
          </div>
          <div class="mt-8 grid grid-cols-2">
            @for (
              dataset of data.age.series;
              track dataset;
              let i = $index;
              let last = $last
            ) {
              <div class="truncate">
                {{ data.age.labels[i] }}
              </div>
              <div class="text-right font-medium">
                {{
                  (data.age.uniqueVisitors * dataset) / 100 | number: '1.0-0'
                }}
              </div>

              @if (!last) {
                <mat-divider class="col-span-full my-2" />
              }
            }
          </div>
        </mat-card>

        <!-- Language -->
        <mat-card
          class="p-6"
          appearance="outlined"
        >
          <div class="truncate text-lg font-medium tracking-tighter">
            Language
          </div>

          <div class="mt-6 flex flex-auto flex-col items-center">
            <apx-chart
              class="h-44"
              [chart]="languageChart.chart"
              [colors]="languageChart.colors"
              [labels]="languageChart.labels"
              [plotOptions]="languageChart.plotOptions"
              [series]="languageChart.series"
              [states]="languageChart.states"
              [tooltip]="languageChart.tooltip()"
            ></apx-chart>
          </div>
          <div class="mt-8 grid grid-cols-2">
            @for (
              dataset of data.language.series;
              track dataset;
              let i = $index;
              let last = $last
            ) {
              <div class="truncate">
                {{ data.language.labels[i] }}
              </div>
              <div class="text-right font-medium">
                {{
                  (data.language.uniqueVisitors * dataset) / 100
                    | number: '1.0-0'
                }}
              </div>

              @if (!last) {
                <mat-divider class="col-span-full my-2" />
              }
            }
          </div>
        </mat-card>
      </div>
    </div>
  `,
})
export default class AnalyticsDashboard {
  // Dependencies
  private analyticsDashboardService = inject(AnalyticsDashboardService);
  private theming = inject(Theming);

  // Data
  protected data = this.analyticsDashboardService.data;

  // Visitors
  protected visitorsChart: {
    chart: ApexChart;
    colors: string[];
    dataLabels: ApexDataLabels;
    fill: ApexFill;
    grid: ApexGrid;
    series: Record<string, ApexAxisChartSeries>;
    stroke: ApexStroke;
    tooltip: Signal<ApexTooltip>;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
  } = {
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
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ['light-dark(var(--color-primary-600), var(--color-primary-500))'],
    dataLabels: {
      enabled: false,
    },
    fill: {
      colors: ['light-dark(var(--color-primary-200), var(--color-primary-600)'],
      gradient: {
        gradientToColors: [
          'light-dark(var(--color-primary-50), var(--color-primary-800)',
        ],
      },
    },
    grid: {
      show: true,
      borderColor:
        'light-dark(var(--color-neutral-200), var(--color-neutral-700))',
      padding: {
        top: -4,
        bottom: -40,
        left: 0,
        right: 0,
      },
      position: 'back',
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    series: this.data.visitors.series,
    stroke: {
      width: 2,
    },
    tooltip: computed(() => ({
      theme: this.theming.isDark() ? 'dark' : 'light',
      x: {
        format: 'MMM dd, yyyy',
      },
      y: {
        formatter: (value: number): string => `${value}`,
      },
    })),
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        stroke: {
          color:
            'light-dark(var(--color-neutral-200), var(--color-neutral-400))',
          dashArray: 0,
          width: 2,
        },
      },
      labels: {
        offsetY: -20,
        style: {
          colors:
            'light-dark(var(--color-neutral-500), var(--color-neutral-400))',
        },
      },
      tickAmount: 20,
      tooltip: {
        enabled: false,
      },
      type: 'datetime',
    },
    yaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      min: (min): number => min - 750,
      max: (max): number => max + 250,
      tickAmount: 5,
      show: false,
    },
  };

  // Conversions
  protected conversionsChart: {
    chart: ApexChart;
    colors: string[];
    fill: ApexFill;
    series: ApexAxisChartSeries;
    stroke: ApexStroke;
    tooltip: ApexTooltip;
  } = {
    chart: {
      animations: {
        enabled: false,
      },
      fontFamily: 'inherit',
      foreColor: 'inherit',
      height: '101%',
      width: '101%',
      type: 'area',
      sparkline: {
        enabled: true,
      },
    },
    colors: ['light-dark(var(--color-neutral-600), var(--color-neutral-400)'],
    fill: {
      colors: ['light-dark(var(--color-neutral-200), var(--color-neutral-600)'],
      gradient: {
        gradientToColors: [
          'light-dark(var(--color-neutral-100), var(--color-neutral-700)',
        ],
      },
    },
    series: this.data.conversions.series,
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    tooltip: {
      enabled: false,
    },
  };

  // Impressions
  protected impressionsChart: {
    chart: ApexChart;
    colors: string[];
    fill: ApexFill;
    series: ApexAxisChartSeries;
    stroke: ApexStroke;
    tooltip: ApexTooltip;
  } = {
    chart: {
      animations: {
        enabled: false,
      },
      fontFamily: 'inherit',
      foreColor: 'inherit',
      height: '101%',
      width: '101%',
      type: 'area',
      sparkline: {
        enabled: true,
      },
    },
    colors: ['light-dark(var(--color-neutral-600), var(--color-neutral-400)'],
    fill: {
      colors: ['light-dark(var(--color-neutral-200), var(--color-neutral-600)'],
      gradient: {
        gradientToColors: [
          'light-dark(var(--color-neutral-100), var(--color-neutral-700)',
        ],
      },
    },
    series: this.data.impressions.series,
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    tooltip: {
      enabled: false,
    },
  };

  // Visits
  protected visitsChart: {
    chart: ApexChart;
    colors: string[];
    fill: ApexFill;
    series: ApexAxisChartSeries;
    stroke: ApexStroke;
    tooltip: ApexTooltip;
  } = {
    chart: {
      animations: {
        enabled: false,
      },
      fontFamily: 'inherit',
      foreColor: 'inherit',
      height: '101%',
      width: '101%',
      type: 'area',
      sparkline: {
        enabled: true,
      },
    },
    colors: ['light-dark(var(--color-neutral-600), var(--color-neutral-400)'],
    fill: {
      colors: ['light-dark(var(--color-neutral-200), var(--color-neutral-600)'],
      gradient: {
        gradientToColors: [
          'light-dark(var(--color-neutral-100), var(--color-neutral-700)',
        ],
      },
    },
    series: this.data.visits.series,
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    tooltip: {
      enabled: false,
    },
  };

  // Visitors vs Page Views
  protected visitorsVsPageViewsChart: {
    chart: ApexChart;
    colors: string[];
    dataLabels: ApexDataLabels;
    fill: ApexFill;
    grid: ApexGrid;
    legend: ApexLegend;
    series: ApexAxisChartSeries;
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
      type: 'area',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ['#64748B', '#94A3B8'],
    dataLabels: {
      enabled: false,
    },
    fill: {
      colors: ['#64748B', '#94A3B8'],
      opacity: 0.5,
    },
    grid: {
      show: false,
      padding: {
        bottom: -40,
        left: 0,
        right: 0,
      },
    },
    legend: {
      show: false,
    },
    series: this.data.visitorsVsPageViews.series,
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    tooltip: computed(() => ({
      theme: this.theming.isDark() ? 'dark' : 'light',
      x: {
        format: 'MMM dd, yyyy',
      },
    })),
    xaxis: {
      axisBorder: {
        show: false,
      },
      labels: {
        offsetY: -20,
        rotate: 0,
        style: {
          colors: 'var(--mat-sys-on-surface)',
        },
      },
      tickAmount: 3,
      tooltip: {
        enabled: false,
      },
      type: 'datetime',
    },
    yaxis: {
      labels: {
        style: {
          colors: 'var(--mat-sys-on-surface)',
        },
      },
      max: (max): number => max + 250,
      min: (min): number => min - 250,
      show: false,
      tickAmount: 5,
    },
  };

  // New vs. returning
  protected newVsReturningChart: {
    chart: ApexChart;
    colors: string[];
    labels: string[];
    plotOptions: ApexPlotOptions;
    series: ApexNonAxisChartSeries;
    states: ApexStates;
    tooltip: Signal<ApexTooltip>;
  } = {
    chart: {
      animations: {
        speed: 400,
        animateGradually: {
          enabled: false,
        },
      },
      fontFamily: 'inherit',
      foreColor: 'inherit',
      height: '100%',
      type: 'donut',
      sparkline: {
        enabled: true,
      },
    },
    colors: ['#3182CE', '#63B3ED'],
    labels: this.data.newVsReturning.labels,
    plotOptions: {
      pie: {
        customScale: 0.9,
        expandOnClick: false,
        donut: {
          size: '70%',
        },
      },
    },
    series: this.data.newVsReturning.series,
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
    tooltip: computed(() => ({
      theme: this.theming.isDark() ? 'dark' : 'light',
      fillSeriesColor: false,
      custom: ({
        seriesIndex,
        w,
      }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                    <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                                                    <div class="ml-2  leading-none">${w.config.labels[seriesIndex]}:</div>
                                                    <div class="ml-2  font-bold leading-none">${w.config.series[seriesIndex]}%</div>
                                                </div>`,
    })),
  };

  // Gender
  protected genderChart: {
    chart: ApexChart;
    colors: string[];
    labels: string[];
    plotOptions: ApexPlotOptions;
    series: ApexNonAxisChartSeries;
    states: ApexStates;
    tooltip: Signal<ApexTooltip>;
  } = {
    chart: {
      animations: {
        speed: 400,
        animateGradually: {
          enabled: false,
        },
      },
      fontFamily: 'inherit',
      foreColor: 'inherit',
      height: '100%',
      type: 'donut',
      sparkline: {
        enabled: true,
      },
    },
    colors: ['#319795', '#4FD1C5'],
    labels: this.data.gender.labels,
    plotOptions: {
      pie: {
        customScale: 0.9,
        expandOnClick: false,
        donut: {
          size: '70%',
        },
      },
    },
    series: this.data.gender.series,
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
    tooltip: computed(() => ({
      theme: this.theming.isDark() ? 'dark' : 'light',
      fillSeriesColor: false,
      custom: ({
        seriesIndex,
        w,
      }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                    <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                                                    <div class="ml-2  leading-none">${w.config.labels[seriesIndex]}:</div>
                                                    <div class="ml-2  font-bold leading-none">${w.config.series[seriesIndex]}%</div>
                                                </div>`,
    })),
  };

  // Age
  protected ageChart: {
    chart: ApexChart;
    colors: string[];
    labels: string[];
    plotOptions: ApexPlotOptions;
    series: ApexNonAxisChartSeries;
    states: ApexStates;
    tooltip: Signal<ApexTooltip>;
  } = {
    chart: {
      animations: {
        speed: 400,
        animateGradually: {
          enabled: false,
        },
      },
      fontFamily: 'inherit',
      foreColor: 'inherit',
      height: '100%',
      type: 'donut',
      sparkline: {
        enabled: true,
      },
    },
    colors: ['#DD6B20', '#F6AD55'],
    labels: this.data.age.labels,
    plotOptions: {
      pie: {
        customScale: 0.9,
        expandOnClick: false,
        donut: {
          size: '70%',
        },
      },
    },
    series: this.data.age.series,
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
    tooltip: computed(() => ({
      theme: this.theming.isDark() ? 'dark' : 'light',
      fillSeriesColor: false,
      custom: ({
        seriesIndex,
        w,
      }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
          <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
          <div class="ml-2  leading-none">${w.config.labels[seriesIndex]}:</div>
          <div class="ml-2  font-bold leading-none">${w.config.series[seriesIndex]}%</div>
      </div>`,
    })),
  };

  // Language
  protected languageChart: {
    chart: ApexChart;
    colors: string[];
    labels: string[];
    plotOptions: ApexPlotOptions;
    series: ApexNonAxisChartSeries;
    states: ApexStates;
    tooltip: Signal<ApexTooltip>;
  } = {
    chart: {
      animations: {
        speed: 400,
        animateGradually: {
          enabled: false,
        },
      },
      fontFamily: 'inherit',
      foreColor: 'inherit',
      height: '100%',
      type: 'donut',
      sparkline: {
        enabled: true,
      },
    },
    colors: ['#805AD5', '#B794F4'],
    labels: this.data.language.labels,
    plotOptions: {
      pie: {
        customScale: 0.9,
        expandOnClick: false,
        donut: {
          size: '70%',
        },
      },
    },
    series: this.data.language.series,
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
    tooltip: computed(() => ({
      theme: this.theming.isDark() ? 'dark' : 'light',
      fillSeriesColor: false,
      custom: ({
        seriesIndex,
        w,
      }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
        <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
        <div class="ml-2  leading-none">${w.config.labels[seriesIndex]}:</div>
        <div class="ml-2  font-bold leading-none">${w.config.series[seriesIndex]}%</div>
      </div>`,
    })),
  };
}
