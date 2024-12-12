import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import rrulePlugin from "@fullcalendar/rrule";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";

interface CalendarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: any[];
  onEventClick: (eventInfo: EventClickArg) => void;
}

export const Calendar = ({ events, onEventClick }: CalendarProps): React.JSX.Element => {
  return (
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
    />
  );
};
