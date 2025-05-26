"use client";

import React from "react";
import { z } from "zod";
import { toast } from "sonner";
import { parseYmdDate, parseYmdHm15Date, getCurrentYmdDate } from "@/lib/utils/date";
import { applyTimezone } from "@/lib/utils/timezone";
import { Calendar } from "@/components/organisms/shared/events/Calendar";
import { CreateEventForm } from "@/components/organisms/specific/events/edit/CreateEventForm";
import { startOfDay, addDays } from "date-fns";
import { createEvent, getMyEvents } from "@/lib/api/events";
import { formSchema } from "@/components/organisms/specific/events/edit/CreateEventForm";
import { Event, mapEventsToFullCalendar } from "@/lib/utils/fullcalendar";

export const EditEventsCalendarForm = (): React.JSX.Element => {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [startDate, setStartDate] = React.useState<Date>(getCurrentYmdDate(new Date()));
  const [endDate, setEndDate] = React.useState<Date>(addDays(getCurrentYmdDate(new Date()), 1));
  const [isAllDay, setIsAllDay] = React.useState<boolean>(true);
  const [recurrences, setRecurrences] = React.useState<string[]>([]);
  const [timezone, setTimezone] = React.useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const fetchEvents = React.useCallback(async () => {
    try {
      const response = await getMyEvents();
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
        toast.error("Failed to fetch events");
      }
    } catch {
      toast.error("Failed to fetch events");
    }
  }, []);

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
        toast.error("Failed to create event");
      } else {
        toast.message("Event registered", {
          description: `You have registered for ${values.summary}`,
        });
      }
    } catch {
      toast.error("Failed to create event");
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

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="md:col-span-2">
        <Calendar
          events={mapEventsToFullCalendar(events)}
          onEventClick={(info) => {
            // TODO: イベント更新フォームを表示する
            console.log(info);
          }}
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
