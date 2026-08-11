import { computed, Injectable, signal } from '@angular/core';
import {
  lastDayOfMonth,
  setDate,
  setHours,
  setMinutes,
  subMonths,
  subYears,
} from 'date-fns';
import { EventInput } from 'fullcalendar';
import {
  CalendarEvent,
  toEventInput,
} from '@/app/domains/admin/modules/apps/calendar/data/model';

const events: CalendarEvent[] = [
  {
    id: 'e8b1a3c5-1f7d-4b0a-9c2e-5d8f6a4b7c9d',
    start: lastDayOfMonth(subMonths(new Date(), 1)),
    end: lastDayOfMonth(subMonths(new Date(), 1)),
    allDay: true,
    title: 'v22.1.0 release',
    description: 'Tag the release and publish the changelog.',
    location: '',
    color: null,
    contrastColor: null,
    display: null,
    recurrence: null,
  },
  {
    id: 'a2f4c6e8-3b5d-4f7a-8c1e-9d2b4f6a8c0e',
    start: setMinutes(setHours(setDate(new Date(), 5), 10), 0),
    end: setMinutes(setHours(setDate(new Date(), 5), 10), 45),
    allDay: false,
    title: 'Sprint planning',
    description: 'Prioritize the backlog for the next sprint.',
    location: 'Meeting room 2',
    color: null,
    contrastColor: null,
    display: null,
    recurrence: null,
  },
  {
    id: 'b3e5d7f9-4c6e-4a8b-9d2f-0e3c5a7b9d1f',
    start: setMinutes(setHours(setDate(new Date(), 5), 13), 0),
    end: setMinutes(setHours(setDate(new Date(), 5), 14), 0),
    allDay: false,
    title: 'Lunch with Sarah',
    description: '',
    location: 'Blue Fig',
    color: null,
    contrastColor: null,
    display: null,
    recurrence: null,
  },
  {
    id: 'c4f6e8a0-5d7f-4b9c-8e3a-1f4d6b8c0e2a',
    start: setMinutes(setHours(setDate(new Date(), 5), 15), 30),
    end: setMinutes(setHours(setDate(new Date(), 5), 16), 30),
    allDay: false,
    title: 'Design review',
    description: 'Walk through the new onboarding flow.',
    location: '',
    color: null,
    contrastColor: null,
    display: null,
    recurrence: null,
  },
  {
    id: 'd5a7f9b1-6e8a-4c0d-9f4b-2a5e7c9d1f3b',
    start: setMinutes(setHours(setDate(new Date(), 5), 18), 0),
    end: setMinutes(setHours(setDate(new Date(), 5), 19), 30),
    allDay: false,
    title: 'Dentist appointment',
    description: '',
    location: '',
    color: null,
    contrastColor: null,
    display: null,
    recurrence: null,
  },
  {
    id: 'e6b8a0c2-7f9b-4d1e-8a5c-3b6f8d0e2a4c',
    start: setDate(new Date(), 14),
    end: setDate(new Date(), 18),
    allDay: true,
    title: 'Days off',
    description: '',
    location: '',
    color: 'color-mix(var(--color-emerald-400), transparent 95%)',
    contrastColor: 'var(--color-emerald-800)',
    display: 'background',
    recurrence: null,
  },
  {
    id: 'f7c9b1d3-8a0c-4e2f-9b6d-4c7a9e1f3b5d',
    start: setMinutes(setHours(setDate(new Date(), 14), 8), 30),
    end: setMinutes(setHours(setDate(new Date(), 15), 13), 0),
    allDay: false,
    title: 'City break',
    description: '',
    location: '',
    color: 'var(--color-amber-500)',
    contrastColor: 'var(--color-white)',
    display: null,
    recurrence: null,
  },
  {
    id: 'a8d0c2e4-9b1d-4f3a-8c7e-5d8b0f2a4c6e',
    start: setMinutes(setHours(setDate(new Date(), 17), 17), 30),
    end: setMinutes(setHours(setDate(new Date(), 17), 19), 0),
    allDay: false,
    title: 'Gym session',
    description: '',
    location: '',
    color: 'var(--color-cyan-500)',
    contrastColor: 'var(--color-white)',
    display: null,
    recurrence: null,
  },
  {
    id: 'b9e1d3f5-0c2e-4a4b-9d8f-6e9c1a3b5d7f',
    start: setMinutes(setHours(setDate(new Date(), 20), 9), 0),
    end: setMinutes(setHours(setDate(new Date(), 20), 17), 0),
    allDay: false,
    title: 'Conference day',
    description: 'Angular meetup, booth duty in the afternoon.',
    location: 'Convention center',
    color: 'var(--color-red-500)',
    contrastColor: 'var(--color-white)',
    display: null,
    recurrence: null,
  },
  {
    id: 'c0f2e4a6-1d3f-4b5c-8e9a-7f0d2b4c6e8a',
    start: setMinutes(setHours(setDate(new Date(), 25), 11), 30),
    end: setMinutes(setHours(setDate(new Date(), 27), 13), 0),
    allDay: false,
    title: 'Business trip',
    description: '',
    location: '',
    color: null,
    contrastColor: null,
    display: null,
    recurrence: null,
  },
  {
    id: 'd1a3f5b7-2e4a-4c6d-9f0b-8a1e3c5d7f9b',
    start: setHours(lastDayOfMonth(new Date()), 17),
    end: setHours(lastDayOfMonth(new Date()), 19),
    allDay: false,
    title: 'Dinner with family',
    description: '',
    location: '',
    color: 'var(--color-teal-500)',
    contrastColor: 'var(--color-white)',
    display: null,
    recurrence: null,
  },

  // Recurring events
  {
    id: 'e2b4a6c8-3f5b-4d7e-8a1c-9b2f4d6e8a0c',
    start: setMinutes(setHours(setDate(subYears(new Date(), 1), 15), 12), 0),
    end: setMinutes(setHours(setDate(subYears(new Date(), 1), 15), 12), 30),
    allDay: false,
    title: 'Pay day!',
    description: '',
    location: '',
    color: null,
    contrastColor: null,
    display: null,
    recurrence: {
      freq: 'monthly',
      count: null,
      until: null,
    },
  },
  {
    id: 'f3c5b7d9-4a6c-4e8f-9b2d-0c3a5e7f9b1d',
    start: setMinutes(
      setHours(lastDayOfMonth(subMonths(new Date(), 1)), 16),
      0
    ),
    end: setMinutes(setHours(lastDayOfMonth(subMonths(new Date(), 1)), 17), 0),
    allDay: false,
    title: 'End of month report',
    description: '',
    location: '',
    color: null,
    contrastColor: null,
    display: null,
    recurrence: {
      freq: 'monthly',
      count: null,
      until: null,
    },
  },
];

@Injectable({ providedIn: 'root' })
export class CalendarService {
  // State
  readonly events = signal<CalendarEvent[]>(events);

  // Computed state
  readonly eventInputs = computed<EventInput[]>(() =>
    this.events().map(toEventInput)
  );

  addEvent(event: CalendarEvent): void {
    this.events.update((events) => [
      ...events,
      { ...event, id: event.id ?? crypto.randomUUID() },
    ]);
  }

  updateEvent(updated: CalendarEvent): void {
    this.events.update((events) =>
      events.map((event) => (event.id === updated.id ? updated : event))
    );
  }

  deleteEvent(id: string): void {
    this.events.update((events) => events.filter((event) => event.id !== id));
  }
}
