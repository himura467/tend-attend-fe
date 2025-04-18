import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getGuestAttendanceStatus, attendEvent } from "@/lib/api/events";
import { useToast } from "@/hooks/use-toast";
import { AttendanceActionType, AttendanceAction } from "@/lib/types/event/attendance";
import { applyTimezone } from "@/lib/utils/timezone";

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
  const { toast } = useToast();
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
          toast({
            title: "An error occurred",
            description: "Failed to fetch attendance status",
            variant: "destructive",
          });
        }
      } catch {
        toast({
          title: "An error occurred",
          description: "Failed to fetch attendance status",
          variant: "destructive",
        });
      }
    }
  }, [eventId, eventStartUTC, toast]);

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
          toast({
            title: "An error occurred",
            description: "Request outside of available time", // TODO: 本来はエラーコードからエラーメッセージを取得するべき
            variant: "destructive",
          });
        }
      } catch {
        toast({
          title: "An error occurred",
          description: "Failed to update attendance status",
          variant: "destructive",
        });
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
