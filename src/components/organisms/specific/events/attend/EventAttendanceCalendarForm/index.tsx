"use client";

import React from "react";
import { useToast } from "@/hooks/use-toast";
import { parseYmdDate, parseYmdHm15Date } from "@/lib/utils/date";
import { getFollowingEvents } from "@/lib/api/events";
import { EventClickArg } from "@fullcalendar/core";
import { Calendar } from "@/components/organisms/shared/events/Calendar";
import { EventAttendanceForm } from "@/components/organisms/specific/events/attend/EventAttendanceForm";
import { Event, mapEventsToFullCalendar } from "@/lib/utils/fullcalendar";
import { EventAttendanceSchedule } from "@/components/organisms/specific/events/attend/EventAttendanceSchedule";
import { Attendance } from "@/lib/types/event/attendance";

export const EventAttendanceCalendarForm = (): React.JSX.Element => {
  const { toast } = useToast();
  const [events, setEvents] = React.useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = React.useState<EventClickArg | null>(null);

  const fetchEvents = React.useCallback(async () => {
    try {
      const response = await getFollowingEvents();
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

  const dummyAttendances = (eventStart: Date): Attendance[] => {
    return [
      {
        id: "1",
        userName: "John Doe",
        userAttendances: [
          {
            userId: 1,
            attendedAt: new Date(eventStart.getTime() + 1000 * 60 * 60),
            leftAt: new Date(eventStart.getTime() + 1000 * 60 * 60 * 2),
          },
        ],
      },
      {
        id: "2",
        userName: "Jane Doe",
        userAttendances: [
          {
            userId: 2,
            attendedAt: new Date(eventStart.getTime() + 1000 * 60 * 60 * 3),
            leftAt: new Date(eventStart.getTime() + 1000 * 60 * 60 * 4),
          },
        ],
      },
    ];
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="md:col-span-2">
        <Calendar events={mapEventsToFullCalendar(events)} onEventClick={onEventClick} />
      </div>
      <div className="space-y-4">
        <EventAttendanceForm
          eventId={selectedEvent?.event.id || null}
          eventSummary={selectedEvent?.event.title || null}
          eventStart={selectedEvent?.event.start || null}
        />
        {selectedEvent?.event.start && selectedEvent?.event.end && selectedEvent?.event.allDay && (
          <EventAttendanceSchedule
            eventStart={selectedEvent?.event.start}
            eventEnd={selectedEvent?.event.end}
            isEventAllDay={selectedEvent?.event.allDay}
            attendances={dummyAttendances(selectedEvent?.event.start)}
          />
        )}
      </div>
    </div>
  );
};
