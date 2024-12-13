import {
  getYmdDeltaDays,
  getYmdHm15DeltaMinutes,
  parseYmdDate,
  parseYmdHm15Date,
  YmdDate,
  YmdHm15Date,
} from "@/lib/utils/date";
import { applyTimezone } from "@/lib/utils/timezone";
import { endOfDay } from "date-fns";
import { parseRecurrence } from "@/lib/utils/rfc5545";

export interface Event {
  id: string;
  summary: string;
  location: string | null;
  start: YmdDate | YmdHm15Date;
  end: YmdDate | YmdHm15Date;
  isAllDay: boolean;
  recurrences: string[];
  timezone: string;
}

export const mapEventsToFullCalendar = (events: Event[]) => {
  return events.map((event) => {
    const baseEvent = {
      id: event.id,
      title: event.summary,
      start: event.isAllDay
        ? event.start
        : applyTimezone(event.start, event.timezone, Intl.DateTimeFormat().resolvedOptions().timeZone),
      end: event.isAllDay
        ? endOfDay(event.end)
        : applyTimezone(event.end, event.timezone, Intl.DateTimeFormat().resolvedOptions().timeZone),
      allDay: event.isAllDay,
    };
    const rrule = parseRecurrence(event.recurrences);
    return rrule
      ? {
          id: baseEvent.id,
          title: baseEvent.title,
          allDay: baseEvent.allDay,
          rrule: { ...rrule.options, dtstart: baseEvent.start },
          duration: baseEvent.allDay
            ? {
                days: getYmdDeltaDays(
                  parseYmdDate(event.start, event.timezone, Intl.DateTimeFormat().resolvedOptions().timeZone),
                  parseYmdDate(event.end, event.timezone, Intl.DateTimeFormat().resolvedOptions().timeZone),
                ),
              }
            : {
                minutes: getYmdHm15DeltaMinutes(
                  parseYmdHm15Date(event.start, event.timezone, Intl.DateTimeFormat().resolvedOptions().timeZone),
                  parseYmdHm15Date(event.end, event.timezone, Intl.DateTimeFormat().resolvedOptions().timeZone),
                ),
              },
        }
      : baseEvent;
  });
};
