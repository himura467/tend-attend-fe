"use client";

import React from "react";
import { useToast } from "@/hooks/use-toast";
import { parseYmdDate, parseYmdHm15Date } from "@/lib/utils/date";
import { getGuestEvents } from "@/lib/api/events";
import { EventClickArg } from "@fullcalendar/core";
import { Calendar } from "@/components/organisms/shared/events/Calendar";
import { EventAttendanceForm } from "@/components/organisms/specific/events/attend/EventAttendanceForm";
import { Event, mapEventsToFullCalendar } from "@/lib/utils/fullcalendar";
import { applyTimezone } from "@/lib/utils/timezone";

export const EventAttendanceCalendarForm = (): React.JSX.Element => {
  const { toast } = useToast();
  const [events, setEvents] = React.useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = React.useState<EventClickArg | null>(null);

  const fetchEvents = React.useCallback(async () => {
    try {
      const response = await getGuestEvents();
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

  const onEventClick = (eventInfo: EventClickArg): void => {
    setSelectedEvent(eventInfo);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="md:col-span-2">
        <Calendar events={mapEventsToFullCalendar(events)} onEventClick={onEventClick} />
      </div>
      <div>
        <EventAttendanceForm
          eventId={selectedEvent?.event.id || null}
          eventSummary={selectedEvent?.event.title || null}
          eventStartUTC={
            selectedEvent
              ? selectedEvent.event.start
                ? applyTimezone(
                    selectedEvent.event.start,
                    Intl.DateTimeFormat().resolvedOptions().timeZone,
                    "UTC",
                  ).toISOString()
                : null
              : null
          }
        />
      </div>
    </div>
  );
};
