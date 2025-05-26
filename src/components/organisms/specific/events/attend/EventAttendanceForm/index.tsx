import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { attendEvent, getGuestAttendanceStatus } from "@/lib/api/events";
import { AttendanceAction, AttendanceActionType } from "@/lib/types/event/attendance";
import { applyTimezone } from "@/lib/utils/timezone";
import React from "react";
import { toast } from "sonner";

interface EventAttendanceFormProps {
  eventId: string | null;
  eventSummary: string | null;
  eventStart: Date | null;
}

export const EventAttendanceForm = ({
  eventId,
  eventSummary,
  eventStart,
}: EventAttendanceFormProps): React.JSX.Element => {
  const [attend, setAttend] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const eventStartUTC = eventStart
    ? applyTimezone(eventStart, Intl.DateTimeFormat().resolvedOptions().timeZone, "UTC")
    : null;

  const fetchAttendanceStatus = React.useCallback(async (): Promise<void> => {
    if (eventId && eventStartUTC) {
      try {
        const response = await getGuestAttendanceStatus(eventId, eventStartUTC.toISOString());
        if (response.error_codes.length === 0) {
          setAttend(response.attend);
        } else {
          toast.error("Failed to fetch attendance status");
        }
      } catch {
        toast.error("Failed to fetch attendance status");
      }
    }
  }, [eventId, eventStartUTC]);

  React.useEffect(() => {
    if (eventId && eventStart) {
      void fetchAttendanceStatus();
    } else {
      setAttend(null);
    }
  }, [eventId, eventStart, fetchAttendanceStatus]);

  const handleSubmit = async (action: AttendanceActionType): Promise<void> => {
    if (eventId && eventStartUTC) {
      setIsLoading(true);
      try {
        const response = await attendEvent({ action: action }, eventId, eventStartUTC.toISOString());
        if (response.error_codes.length === 0) {
          await fetchAttendanceStatus();
        } else {
          // TODO: 本来はエラーコードからエラーメッセージを取得するべき
          toast.error("Request outside of available time");
        }
      } catch {
        toast.error("Failed to update attendance status");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {eventSummary
            ? `Attendance for ${eventSummary} at ${eventStart?.toLocaleString("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false })}`
            : "Select an event"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {attend !== null && <p>{attend ? "You are attending this event" : "You are not attending this event"}</p>}
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => handleSubmit(attend ? AttendanceAction.LEAVE : AttendanceAction.ATTEND)}
          disabled={!eventId || isLoading}
        >
          {isLoading ? "Processing..." : attend ? "Leave" : "Attend"}
        </Button>
      </CardFooter>
    </Card>
  );
};
