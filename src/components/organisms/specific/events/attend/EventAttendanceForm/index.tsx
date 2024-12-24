import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getGuestCurrentAttendanceStatus, attendEvent } from "@/lib/api/events";
import { useToast } from "@/hooks/use-toast";
import { AttendanceActionType, AttendanceAction } from "@/lib/types/event/attendance";

interface EventAttendanceFormProps {
  eventId: string | null;
  eventSummary: string | null;
  eventStartUTC: string | null;
}

export const EventAttendanceForm = ({
  eventId,
  eventSummary,
  eventStartUTC,
}: EventAttendanceFormProps): React.JSX.Element => {
  const { toast } = useToast();
  const [attend, setAttend] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchAttendanceStatus = React.useCallback(async (): Promise<void> => {
    if (eventId && eventStartUTC) {
      try {
        const response = await getGuestCurrentAttendanceStatus(eventId, eventStartUTC);
        if (response.error_codes.length === 0) {
          setAttend(response.attend);
        } else {
          toast({
            title: "An error occurred",
            description: "Request outside of available time",
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
    if (eventId && eventStartUTC) {
      void fetchAttendanceStatus();
    } else {
      setAttend(null);
    }
  }, [eventId, eventStartUTC, fetchAttendanceStatus]);

  const handleSubmit = async (action: AttendanceActionType): Promise<void> => {
    if (eventId && eventStartUTC) {
      setIsLoading(true);
      try {
        await attendEvent({ action: action }, eventId, eventStartUTC);
        await fetchAttendanceStatus();
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
        <CardTitle>{eventSummary ? `Attendance for ${eventSummary} at ${eventStartUTC}` : "Select an event"}</CardTitle>
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
