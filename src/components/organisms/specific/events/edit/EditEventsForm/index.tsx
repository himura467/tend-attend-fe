"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import rrulePlugin from "@fullcalendar/rrule";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  YmdDate,
  YmdHm15Date,
  parseYmdDate,
  parseYmdHm15Date,
  getCurrentYmdDate,
  getYmdDeltaDays,
  getYmdHm15DeltaMinutes,
} from "@/lib/utils/date";
import { applyTimezone } from "@/lib/utils/timezone";
import { CreateEventForm } from "@/components/organisms/specific/events/edit/CreateEventForm";
import { startOfDay, endOfDay, addDays } from "date-fns";
import { createEvent, getHostEvents } from "@/lib/api/events";
import { parseRecurrence } from "@/lib/utils/rfc5545";
import { formSchema } from "@/components/organisms/specific/events/edit/CreateEventForm";

interface Event {
  id: string;
  summary: string;
  location: string | null;
  start: YmdDate | YmdHm15Date;
  end: YmdDate | YmdHm15Date;
  isAllDay: boolean;
  recurrences: string[];
  timezone: string;
}

export const EditEventsForm = (): React.JSX.Element => {
  const { toast } = useToast();
  const [events, setEvents] = React.useState<Event[]>([]);
  const [startDate, setStartDate] = React.useState<Date>(getCurrentYmdDate(new Date()));
  const [endDate, setEndDate] = React.useState<Date>(addDays(getCurrentYmdDate(new Date()), 1));
  const [isAllDay, setIsAllDay] = React.useState<boolean>(true);
  const [recurrences, setRecurrences] = React.useState<string[]>([]);
  const [timezone, setTimezone] = React.useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const fetchEvents = React.useCallback(async () => {
    try {
      const response = await getHostEvents();
      if (response.error_codes.length === 0) {
        setEvents(
          response.events.map((event) => {
            const start = new Date(Date.parse(event.start));
            const end = new Date(Date.parse(event.end));

            return {
              id: event.id,
              summary: event.summary,
              location: event.location,
              start: event.is_all_day
                ? parseYmdDate(start, "UTC", event.timezone)
                : parseYmdHm15Date(start, "UTC", event.timezone),
              end: event.is_all_day
                ? parseYmdDate(end, "UTC", event.timezone)
                : parseYmdHm15Date(end, "UTC", event.timezone),
              isAllDay: event.is_all_day,
              recurrences: event.recurrence_list,
              timezone: event.timezone,
            };
          }),
        );
      } else {
        toast({
          title: "An error occurred",
          description: "Failed to fetch events",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "An error occurred",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    }
  }, [toast]);

  React.useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]);

  const onSubmit = async (values: z.infer<typeof formSchema>): Promise<void> => {
    try {
      const response = await createEvent({
        event: {
          summary: values.summary,
          location: values.location,
          start: applyTimezone(startDate, timezone, "UTC").toISOString(),
          end: applyTimezone(endDate, timezone, "UTC").toISOString(),
          is_all_day: isAllDay,
          recurrence_list: recurrences,
          timezone: timezone,
        },
      });

      if (response.error_codes.length > 0) {
        toast({
          title: "An error occurred",
          description: "Failed to create event",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Event registered",
          description: `You have registered for ${values.summary}`,
        });
      }
    } catch {
      toast({
        title: "An error occurred",
        description: "Failed to create event",
        variant: "destructive",
      });
    }

    setStartDate(getCurrentYmdDate(new Date()));
    setEndDate(addDays(getCurrentYmdDate(new Date()), 1));
    setIsAllDay(true);
    setRecurrences([]);
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);

    await fetchEvents();
  };

  const handleStartDateChange = (date: Date): void => {
    setStartDate(date);
    if (date > endDate) {
      setEndDate(addDays(date, 1));
    }
  };

  const handleEndDateChange = (date: Date): void => {
    if (date > startDate) {
      setEndDate(date);
    }
  };

  const handleIsAllDayChange = (allDay: boolean): void => {
    setIsAllDay(allDay);
    if (allDay) {
      setStartDate(startOfDay(startDate));
      setEndDate(startOfDay(endDate));
    }
  };

  const mapEventsToFullCalendar = (events: Event[]) => {
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

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <FullCalendar
          plugins={[rrulePlugin, dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={mapEventsToFullCalendar(events)}
        />
      </div>
      <div>
        <CreateEventForm
          onSubmit={onSubmit}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          isAllDay={isAllDay}
          onIsAllDayChange={handleIsAllDayChange}
          recurrences={recurrences}
          onRecurrencesChange={setRecurrences}
          timezone={timezone}
          onTimezoneChange={setTimezone}
        />
      </div>
    </div>
  );
};
