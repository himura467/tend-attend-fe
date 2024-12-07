"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import rrulePlugin from "@fullcalendar/rrule";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  toISOStringWithTimezone,
  YmdDate,
  YmdHm15Date,
  parseYmdDate,
  parseYmdHm15Date,
  isYmdDate,
  getCurrentYmdDate,
  applyTimezone,
  parseISOStringWithTimezone,
  getYmdDeltaDays,
  getYmdHm15DeltaMinutes,
} from "@/lib/utils/date";
import { DateTimePicker } from "@/components/organisms/shared/events/DateTimePicker";
import { startOfDay, endOfDay, addDays } from "date-fns";
import { createEvent, getHostEvents } from "@/lib/api/events";
import { routerPush } from "@/lib/utils/router";
import { parseRecurrence, toDatetime } from "@/lib/utils/rfc5545";

interface Event {
  summary: string;
  location: string | null;
  start: YmdDate | YmdHm15Date;
  end: YmdDate | YmdHm15Date;
  recurrences: string[];
  timezone: string;
}

const formSchema = z.object({
  summary: z.string({
    required_error: "A summary is required.",
  }),
  location: z.string().nullable(),
});

interface CreateEventFormProps {
  location: string;
}

export const CreateEventForm = ({ location }: CreateEventFormProps): React.JSX.Element => {
  const router = useRouter();
  const { toast } = useToast();
  const [events, setEvents] = React.useState<Event[]>([]);
  const [startDate, setStartDate] = React.useState<Date>(getCurrentYmdDate(new Date()));
  const [endDate, setEndDate] = React.useState<Date>(addDays(getCurrentYmdDate(new Date()), 1));
  const [isAllDay, setIsAllDay] = React.useState<boolean>(true);
  const [recurrences, setRecurrences] = React.useState<string[]>([]);
  const [timezone, setTimezone] = React.useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [error, setError] = React.useState("");

  const fetchEvents = React.useCallback(async () => {
    try {
      const response = await getHostEvents();
      if (response.error_codes.length === 0) {
        setEvents(
          response.events.map((event) => {
            const [start, startTz] = parseISOStringWithTimezone(event.start);
            const [end, endTz] = parseISOStringWithTimezone(event.end);
            if (startTz !== endTz) {
              throw new Error("Start and end timezones do not match");
            }

            return {
              summary: event.summary,
              location: event.location,
              start: event.is_all_day ? parseYmdDate(start) : parseYmdHm15Date(start),
              end: event.is_all_day ? parseYmdDate(end) : parseYmdHm15Date(end),
              recurrences: event.recurrence_list,
              timezone: startTz,
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      summary: "",
      location: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>): Promise<void> => {
    setError("");

    try {
      const response = await createEvent({
        event: {
          summary: values.summary,
          location: values.location,
          start: toISOStringWithTimezone(startDate, timezone),
          end: toISOStringWithTimezone(endDate, timezone),
          recurrence_list: recurrences,
          is_all_day: isAllDay,
        },
      });

      if (response.error_codes.length > 0) {
        setError("An error occurred. Please try again.");
      } else {
        routerPush({ href: location }, router);
      }
    } catch {
      setError("An unexpected error occurred. Please try again later.");
    }

    toast({
      title: "Event registered",
      description: `You have registered for ${values.summary}`,
    });
    form.reset();
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
        title: event.summary,
        start: isYmdDate(event.start) ? event.start : applyTimezone(event.start, event.timezone),
        end: isYmdDate(event.end) ? endOfDay(event.end) : applyTimezone(event.end, event.timezone),
        allDay: isYmdDate(event.start),
      };
      const rrule = parseRecurrence(event.recurrences);
      return rrule
        ? {
            title: baseEvent.title,
            allDay: baseEvent.allDay,
            rrule: { ...rrule.options, dtstart: toDatetime(baseEvent.start) },
            duration: baseEvent.allDay
              ? { days: getYmdDeltaDays(parseYmdDate(event.start), parseYmdDate(event.end)) }
              : { minutes: getYmdHm15DeltaMinutes(parseYmdHm15Date(event.start), parseYmdHm15Date(event.end)) },
          }
        : baseEvent;
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <FullCalendar
          plugins={[rrulePlugin, dayGridPlugin]}
          initialView="dayGridMonth"
          events={mapEventsToFullCalendar(events)}
        />
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Input placeholder="Event summary" {...field} />
                  </FormControl>
                  <FormDescription>Provide a brief summary of the event.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Event location" {...field} value={field.value ?? undefined} />
                  </FormControl>
                  <FormDescription>Where will the event take place?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Event Time</FormLabel>
              <DateTimePicker
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
            {error && <p>{error}</p>}
            <Button type="submit">Create Event</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
