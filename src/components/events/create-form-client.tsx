"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/hooks/use-toast";
import { YmdDate, YmdHm15Date, parseYmdDate, parseYmdHm15Date, getCurrentYmdDate } from "@/utils/date";
import DateTimePicker from "@/components/ui/date-time-picker";
import { startOfDay, addHours } from "date-fns";

interface Event {
  summary: string;
  location: string | null;
  start: YmdDate | YmdHm15Date;
  end: YmdDate | YmdHm15Date;
  recurrence: string | null;
}

const sampleEvents: Event[] = [
  {
    summary: "Team Meeting",
    location: "Conference Room A",
    start: parseYmdDate(new Date("2000-01-01T00:00:00")),
    end: parseYmdDate(new Date("2000-02-01T00:00:00")),
    recurrence: "RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR",
  },
  {
    summary: "Yoga Class",
    location: "Gym",
    start: parseYmdHm15Date(new Date("2000-01-01T18:00:00")),
    end: parseYmdHm15Date(new Date("2000-01-01T19:00:00")),
    recurrence: null,
  },
];

const formSchema = z.object({
  summary: z.string({
    required_error: "A summary is required.",
  }),
  location: z.string().nullable(),
});

export default function CreateEventFormClient() {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [startDate, setStartDate] = useState<Date>(getCurrentYmdDate(new Date()));
  const [endDate, setEndDate] = useState<Date>(addHours(getCurrentYmdDate(new Date()), 1));
  const [isAllDay, setIsAllDay] = useState<boolean>(false);
  const [recurrence, setRecurrence] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      summary: "",
      location: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newEvent: Event = {
      summary: values.summary,
      location: values.location,
      start: isAllDay ? parseYmdDate(startDate) : parseYmdHm15Date(startDate),
      end: isAllDay ? parseYmdDate(endDate) : parseYmdHm15Date(endDate),
      recurrence: recurrence,
    };
    setEvents([...events, newEvent]);
    toast({
      title: "Event registered",
      description: `You have registered for ${values.summary}`,
    });
    form.reset();
    setStartDate(getCurrentYmdDate(new Date()));
    setEndDate(addHours(getCurrentYmdDate(new Date()), 1));
    setIsAllDay(true);
    setRecurrence(null);
  }

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
    if (date > endDate) {
      setEndDate(addHours(date, 1));
    }
  };

  const handleEndDateChange = (date: Date) => {
    if (date > startDate) {
      setEndDate(date);
    }
  };

  const handleIsAllDayChange = (allDay: boolean) => {
    setIsAllDay(allDay);
    if (allDay) {
      setStartDate(startOfDay(startDate));
      setEndDate(startOfDay(endDate));
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events.map((event) => ({
            title: event.summary,
            start: event.start,
            end: event.end,
            allDay: isAllDay,
          }))}
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
                recurrence={recurrence}
                onRecurrenceChange={setRecurrence}
              />
            </div>
            <Button type="submit">Create Event</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
