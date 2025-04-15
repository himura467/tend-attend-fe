"use client";

import React from "react";
import { useToast } from "@/hooks/use-toast";
import { parseYmdDate, parseYmdHm15Date } from "@/lib/utils/date";
import { getFollowingEvents, getAttendanceTimeForecasts } from "@/lib/api/events";
import { AttendanceTime } from "@/lib/api/dtos/event";
import { EventClickArg } from "@fullcalendar/core";
import { Calendar } from "@/components/organisms/shared/events/Calendar";
import { EventAttendanceForm } from "@/components/organisms/specific/events/attend/EventAttendanceForm";
import { Event, mapEventsToFullCalendar } from "@/lib/utils/fullcalendar";
import { EventAttendanceSchedule } from "@/components/organisms/specific/events/attend/EventAttendanceSchedule";
import { Attendance } from "@/lib/types/event/attendance";
import { applyTimezone } from "@/lib/utils/timezone";

export const EventAttendanceCalendarForm = (): React.JSX.Element => {
  const { toast } = useToast();
  const [events, setEvents] = React.useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = React.useState<EventClickArg | null>(null);
  const [userId, setUserId] = React.useState<number | null>(null);
  const [username, setUsername] = React.useState<string | null>(null);
  const [attendanceTimeForecasts, setAttendanceTimeForecasts] = React.useState<{
    [key: string]: AttendanceTime[];
  }>({});

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

  const fetchAttendanceTimeForecasts = React.useCallback(async () => {
    try {
      const response = await getAttendanceTimeForecasts();
      if (response.error_codes.length === 0) {
        setUserId(response.user_id);
        setUsername(response.username);
        setAttendanceTimeForecasts(response.attendance_time_forecasts);
      } else {
        toast({
          title: "An error occurred",
          description: "Failed to fetch attendance time forecasts",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "An error occurred",
        description: "Failed to fetch attendance time forecasts",
        variant: "destructive",
      });
    }
  }, [toast]);

  React.useEffect(() => {
    void fetchEvents();
    void fetchAttendanceTimeForecasts();
  }, [fetchEvents, fetchAttendanceTimeForecasts]);

  const onEventClick = (eventInfo: EventClickArg): void => {
    setSelectedEvent(eventInfo);
  };

  const getAttendances = (eventId: string, eventStart: Date): Attendance[] => {
    if (!attendanceTimeForecasts[eventId]) return [];

    const forecasts = attendanceTimeForecasts[eventId].filter(
      (forecast) =>
        applyTimezone(
          new Date(Date.parse(forecast.start)),
          "UTC",
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        ).getTime() === eventStart.getTime(),
    );

    return forecasts.map((forecast, index) => ({
      id: index.toString(),
      userName: username!,
      userAttendances: [
        {
          userId: userId!,
          attendedAt: applyTimezone(
            new Date(Date.parse(forecast.attended_at)),
            "UTC",
            Intl.DateTimeFormat().resolvedOptions().timeZone,
          ),
          leftAt: applyTimezone(
            new Date(new Date(Date.parse(forecast.attended_at)).getTime() + forecast.duration * 1000),
            "UTC",
            Intl.DateTimeFormat().resolvedOptions().timeZone,
          ),
        },
      ],
    }));
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
            attendances={getAttendances(selectedEvent?.event.id, selectedEvent?.event.start)}
          />
        )}
      </div>
    </div>
  );
};
