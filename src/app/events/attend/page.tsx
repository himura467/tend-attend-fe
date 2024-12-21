import { DialogTemplate } from "@/components/templates/DialogTemplate";
import { NextPage } from "next";
import { EventAttendanceCalendarForm } from "@/components/organisms/specific/events/attend/EventAttendanceCalendarForm";

const AttendEventPage: NextPage = (): React.JSX.Element => {
  return (
    <DialogTemplate>
      <div className="w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Attend Event</h1>
        </div>
        <EventAttendanceCalendarForm />
      </div>
    </DialogTemplate>
  );
};

export default AttendEventPage;
