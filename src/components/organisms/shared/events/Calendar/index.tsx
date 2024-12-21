import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import rrulePlugin from "@fullcalendar/rrule";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import { Card, CardContent } from "@/components/ui/card";

interface CalendarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: any[];
  onEventClick: (eventInfo: EventClickArg) => void;
}

export const Calendar = ({ events, onEventClick }: CalendarProps): React.JSX.Element => {
  return (
    <Card>
      <CardContent className="p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, rrulePlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          eventClick={onEventClick}
          height="auto"
        />
      </CardContent>
    </Card>
  );
};
