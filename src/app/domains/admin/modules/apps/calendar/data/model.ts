import { addDays, formatISO, intervalToDuration } from 'date-fns';
import { EventApi, EventInput } from 'fullcalendar';

/**
 * Represents the recurrence pattern of an event using the RRULE format.
 */
export type EventRecurrence = {
  freq: string;
  count: number | null;
  until: Date | null;
};

/**
 * Represents a calendar event in the domain model, which may or may not be
 * recurring.
 */
export type CalendarEvent = {
  id: string | null;
  start: Date | string;
  end: Date | string;
  allDay: boolean;
  title: string;
  description: string;
  location: string;
  color: string | null;
  contrastColor: string | null;
  display: string | null;
  recurrence: EventRecurrence | null;
};

/**
 * Creates a blank "CalendarEvent" with default values, which can be overridden.
 * @param overrides
 */
export function createBlankEvent(
  overrides: Partial<CalendarEvent> = {}
): CalendarEvent {
  return {
    id: null,
    title: '',
    description: '',
    location: '',
    start: new Date(),
    end: new Date(),
    allDay: true,
    color: null,
    contrastColor: null,
    display: null,
    recurrence: null,
    ...overrides,
  };
}

/**
 * Maps a domain "CalendarEvent" to a FullCalendar "EventInput".
 * @param event
 */
export function toEventInput(event: CalendarEvent): EventInput {
  const base: EventInput = {
    id: event.id ?? undefined,
    title: event.title,
    allDay: event.allDay,
    color: event.color ?? '',
    contrastColor: event.contrastColor ?? '',
    display: event.display ?? undefined,
    extendedProps: {
      description: event.description,
      location: event.location,
    },
  };

  // Use the "rrule" shape for recurring events. The duration of each instance
  // is derived from the difference between the event's start and end.
  if (event.recurrence) {
    base.rrule = {
      freq: event.recurrence.freq,
      dtstart: formatISO(event.start),
    };

    base.duration = intervalToDuration({ start: event.start, end: event.end });
  }
  // For non-recurring events, just use start/end directly. For "all-day" events,
  // convert the inclusive end date to exclusive by adding one day, so FullCalendar
  // displays it correctly.
  else {
    base.start = event.start;
    base.end = event.allDay ? addDays(event.end, 1) : event.end;
  }

  return base;
}

/**
 * Reconstructs a domain "CalendarEvent" from FullCalendar's "EventApi".
 * @param fcEvent
 */
export function fromEventApi(fcEvent: EventApi): CalendarEvent {
  // For all-day events, FullCalendar treats the end date as exclusive, so we
  // need to convert it back to inclusive by subtracting one day. For
  // non-all-day events, we can use the end date as-is. If end is missing, we
  // fall back to start or current date to avoid errors.
  let end = fcEvent.end ?? fcEvent.start ?? new Date();
  if (fcEvent.allDay) {
    end = addDays(end, -1);
  }

  return {
    id: fcEvent.id || null,
    title: fcEvent.title,
    description: fcEvent.extendedProps['description'] ?? '',
    location: fcEvent.extendedProps['location'] ?? '',
    start: fcEvent.start ?? new Date(),
    end,
    allDay: fcEvent.allDay,
    color: fcEvent.color || null,
    contrastColor: fcEvent.contrastColor || null,
    display: fcEvent.display || null,
    recurrence: null,
  };
}
