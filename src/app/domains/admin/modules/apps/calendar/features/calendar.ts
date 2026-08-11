import {
  afterRenderEffect,
  Component,
  effect,
  inject,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatPseudoCheckbox } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import {
  CalendarOptions,
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/angular/daygrid';
import interactionPlugin from '@fullcalendar/angular/interaction';
import classicThemePlugin from '@fullcalendar/angular/themes/classic';
import timeGridPlugin from '@fullcalendar/angular/timegrid';
import rrulePlugin from '@fullcalendar/rrule';
import { subDays } from 'date-fns';
import { Calendar as CalendarApi } from 'fullcalendar';
import { CalendarService } from '@/app/domains/admin/modules/apps/calendar/data/calendar';
import {
  createBlankEvent,
  fromEventApi,
} from '@/app/domains/admin/modules/apps/calendar/data/model';
import EventForm from '@/app/domains/admin/modules/apps/calendar/features/event-form';

type View = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';

@Component({
  selector: 'calendar',
  encapsulation: ViewEncapsulation.None,
  imports: [
    FullCalendarModule,
    MatButton,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatPseudoCheckbox,
    MatTooltip,
  ],
  styleUrl: '../styles/fullcalendar.css',
  host: {
    class:
      'flex h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)] flex-auto flex-col overflow-hidden lg:h-auto',
  },
  template: `
    <!-- Header -->
    <div
      class="flex flex-wrap items-center gap-4 border-b px-6 py-4 lg:px-8 lg:py-8"
    >
      <div class="flex flex-col gap-y-0.5">
        <div class="text-xl font-semibold tracking-tighter sm:text-2xl">
          Calendar
        </div>
        <div class="text-neutral-500">{{ title() }}</div>
      </div>

      <!-- Spacer -->
      <div class="flex-auto"></div>

      <!-- Navigation -->
      <div class="flex items-center gap-x-1">
        <button
          matIconButton
          [matTooltip]="'Previous'"
          (click)="prev()"
        >
          <mat-icon svgIcon="chevron-left" />
        </button>
        <button
          matButton
          (click)="today()"
        >
          Today
        </button>
        <button
          matIconButton
          [matTooltip]="'Next'"
          (click)="next()"
        >
          <mat-icon svgIcon="chevron-right" />
        </button>
      </div>

      <!-- View -->
      <button
        matButton="outlined"
        [matMenuTriggerFor]="viewMenu"
      >
        {{ currentViewLabel() }}
        <mat-icon
          svgIcon="chevron-down"
          iconPositionEnd
        />
      </button>
      <mat-menu #viewMenu>
        @for (view of viewOptions; track view.name) {
          <button
            mat-menu-item
            (click)="currentView.set(view.name)"
          >
            <mat-pseudo-checkbox
              appearance="minimal"
              [state]="view.name === currentView() ? 'checked' : 'unchecked'"
            />
            <span class="ml-1 flex-auto">{{ view.label }}</span>
          </button>
        }
      </mat-menu>

      <!-- Actions -->
      <button
        matButton="filled"
        (click)="addEvent()"
      >
        <mat-icon svgIcon="plus" />
        Add
      </button>
    </div>

    <!-- Calendar -->
    <div class="flex flex-auto flex-col overflow-hidden pt-1">
      @defer {
        <full-calendar
          [options]="calendarOptions"
          [events]="calendarEvents()"
          #fullCalendar
        />
      }
    </div>
  `,
})
export default class Calendar {
  // Dependencies
  private calendarService = inject(CalendarService);
  private matDialog = inject(MatDialog);

  // DOM
  private fullCalendar = viewChild<FullCalendarComponent>('fullCalendar');

  // State
  protected title = signal('');
  protected viewOptions: { name: View; label: string }[] = [
    { name: 'dayGridMonth', label: 'Month' },
    { name: 'timeGridWeek', label: 'Week' },
    { name: 'timeGridDay', label: 'Day' },
  ];
  protected currentView = signal<View>('dayGridMonth');
  protected currentViewLabel = () =>
    this.viewOptions.find((option) => option.name === this.currentView())
      ?.label;

  // Computed state
  protected calendarEvents = this.calendarService.eventInputs;

  private calendarApi: CalendarApi | undefined = undefined;
  protected calendarOptions: CalendarOptions = {
    plugins: [
      rrulePlugin,
      classicThemePlugin,
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
    ],
    initialView: this.currentView(),
    height: '100%',
    borderless: true,

    // Interaction options
    editable: true,
    eventStartEditable: true,
    eventResizableFromStart: true,
    eventDurationEditable: true,

    // Enable date selection
    selectable: true,
    selectMirror: true,

    // View definitions
    views: {
      timeGridWeek: {
        titleFormat: { year: 'numeric', month: 'short', day: 'numeric' },
      },
    },

    // Now indicator
    nowIndicator: true,

    // Callback for date range changes
    datesSet: (data) => {
      this.title.set(data.view.title);
    },

    // Callback for event click
    eventClick: (data) => {
      this.openEventDialog(fromEventApi(data.event));
    },

    // Callback for event drag & drop / resize
    eventDrop: (data) => {
      this.calendarService.updateEvent(fromEventApi(data.event));
    },
    eventResize: (data) => {
      this.calendarService.updateEvent(fromEventApi(data.event));
    },

    // Callback for date selection
    select: (data) => {
      // Create a new blank event based on the selection
      const newEvent = createBlankEvent({
        start: data.start,
        end: data.allDay ? subDays(data.end, 1) : data.end,
        allDay: data.allDay,
      });

      this.calendarApi?.unselect();
      this.openEventDialog(newEvent);
    },

    // Set Monday as the first day of the week
    firstDay: 1,

    // Keep the number of weeks consistent across months
    fixedWeekCount: true,

    // Event display options
    dayMaxEventRows: 3,
    eventTimeFormat: {
      hour: 'numeric',
      minute: '2-digit',
      meridiem: 'short',
    },

    // Styling -----------------------------------------------------------------
    // Highlight styles
    highlightClass: 'rounded-lg bg-primary-50/50 dark:bg-primary-950/50',

    // All day styles
    allDayHeaderInnerClass: 'text-sm',
    allDayDividerClass: 'h-px border-0 border-t p-0',

    // Slot header styles
    slotHeaderInnerClass: 'text-sm',

    // Day header styles
    dayHeaderClass: (state) =>
      state.inPopover
        ? 'border-0 bg-white p-3 pb-1 dark:bg-neutral-800'
        : 'border-0',
    dayHeaderInnerClass: (state) =>
      state.inPopover
        ? 'text-sm text-neutral-500'
        : 'pb-1 text-sm text-neutral-500',

    // Day cell styles
    dayCellClass: (state) =>
      state.inPopover
        ? 'min-h-20 bg-white dark:bg-neutral-800'
        : 'min-h-20 bg-transparent',
    dayCellTopInnerClass: (state) =>
      [
        'm-1 flex size-6 items-center justify-center rounded-full text-sm',
        state.isOther ? 'text-neutral-400 dark:text-neutral-600' : '',
        state.isToday ? 'bg-primary-600 font-medium text-white' : '',
      ].join(' '),
    dayCellInnerClass: '*:border-0',

    // Common event styles
    eventClass:
      'border-0 p-0 bg-(--fc-event-color) text-(--fc-event-contrast-color)',
    eventInnerClass: 'flex items-center gap-x-1',
    eventTimeClass: 'px-0 text-xs font-medium',
    eventTitleClass: 'truncate px-0 text-xs font-normal',

    // List event styles
    listItemEventClass: 'mx-1 mb-0.5 rounded-sm',
    listItemEventInnerClass: 'px-1.5 py-px',
    listItemEventBeforeClass: 'hidden',

    // Row event styles
    rowEventClass: (state) =>
      [
        'mx-0 mb-0.5',
        state.isStart ? 'ms-1 rounded-s-sm' : '',
        state.isEnd ? 'me-1 rounded-e-sm' : '',
      ].join(' '),
    rowEventInnerClass: 'px-1.5 py-px',

    // Column event styles
    columnEventTimeClass: 'w-full truncate',
    columnEventTitleClass: 'w-full truncate',

    // Background event styles
    backgroundEventClass:
      'pointer-events-none bg-(--fc-event-color) text-(--fc-event-contrast-color)',
    backgroundEventInnerClass: 'items-start',
    backgroundEventTitleClass: 'truncate px-2 py-1.5 not-italic',

    // Common 'more' link styles
    moreLinkClass: 'border-0 underline-offset-2 hover:underline',

    // Common popover styles
    popoverClass: 'overflow-hidden rounded-lg shadow-lg',
    popoverCloseClass: 'top-2.5 right-3 size-4 rtl:left-3',
  };

  constructor() {
    // Get the calendar API once the view has been rendered
    afterRenderEffect(() => {
      const fullCalendar = this.fullCalendar();
      if (!fullCalendar) {
        return;
      }

      this.calendarApi = fullCalendar.getApi();
    });

    // Update the calendar view when the currentView signal changes
    effect(() => {
      const view = this.currentView();
      this.calendarApi?.changeView(view);
    });
  }

  today() {
    this.calendarApi?.today();
  }

  prev() {
    this.calendarApi?.prev();
  }

  next() {
    this.calendarApi?.next();
  }

  addEvent() {
    this.openEventDialog(createBlankEvent({ allDay: false }));
  }

  private openEventDialog(event: ReturnType<typeof createBlankEvent>) {
    this.matDialog.open(EventForm, {
      data: event,
      width: '480px',
      maxWidth: '90vw',
      autoFocus: false,
    });
  }
}
