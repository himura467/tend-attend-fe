import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { attendEvent, getGuestAttendanceStatus } from "@/lib/api/events";
import { AttendanceAction, AttendanceActionType } from "@/lib/types/event/attendance";
import { applyTimezone } from "@/lib/utils/timezone";
import React from "react";
import { toast } from "sonner";

interface EventAttendanceFormProps {
  eventId: string | null;
  eventSummary: string | null;
  eventStart: Date | null;
  eventEnd: Date | null;
  attendances: { action: string; acted_at: string }[];
  onAttendanceUpdate: (eventId: string, eventStart: Date, eventEnd: Date) => Promise<void>;
}

interface EditableAttendance {
  action: AttendanceActionType;
  acted_at: string;
  isEditing: boolean;
  isNew: boolean;
}

export const EventAttendanceForm = ({
  eventId,
  eventSummary,
  eventStart,
  eventEnd,
  attendances,
  onAttendanceUpdate,
}: EventAttendanceFormProps): React.JSX.Element => {
  const [attend, setAttend] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [editableAttendances, setEditableAttendances] = React.useState<EditableAttendance[]>([]);
  const [isEditMode, setIsEditMode] = React.useState(false);

  const eventStartUTC = eventStart
    ? applyTimezone(eventStart, Intl.DateTimeFormat().resolvedOptions().timeZone, "UTC")
    : null;

  React.useEffect(() => {
    setEditableAttendances(
      attendances.map((attendance) => ({
        action: attendance.action as AttendanceActionType,
        acted_at: attendance.acted_at,
        isEditing: false,
        isNew: false,
      })),
    );
  }, [attendances]);

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
          if (eventStart && eventEnd) {
            await onAttendanceUpdate(eventId, eventStart, eventEnd);
          }
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
      <CardContent className="space-y-4">
        {attend !== null && <p>{attend ? "You are attending this event" : "You are not attending this event"}</p>}
        <div className="space-y-2">
          <h3 className="font-medium">Your Attendance Record</h3>
          <ScrollArea className="h-[200px] rounded-md border p-4">
            {attendances.length > 0 ? (
              attendances
                .sort((a, b) => new Date(a.acted_at).getTime() - new Date(b.acted_at).getTime())
                .map((attendance, index) => (
                  <div key={index} className="mb-2 space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        {applyTimezone(
                          new Date(attendance.acted_at),
                          "UTC",
                          Intl.DateTimeFormat().resolvedOptions().timeZone,
                        ).toLocaleString()}
                      </span>
                      <span className={attendance.action === "attend" ? "text-green-600" : "text-red-600"}>
                        {attendance.action === "attend" ? "Attended" : "Left"}
                      </span>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-sm text-muted-foreground">No attendance history</p>
            )}
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex w-full gap-2">
          <Button
            className="flex-1"
            onClick={() => handleSubmit(AttendanceAction.ATTEND)}
            disabled={!eventId || isLoading}
            variant={attend ? "secondary" : "default"}
          >
            {isLoading ? "Processing..." : "Attend"}
          </Button>
          <Button
            className="flex-1"
            onClick={() => handleSubmit(AttendanceAction.LEAVE)}
            disabled={!eventId || isLoading}
            variant={!attend ? "secondary" : "default"}
          >
            {isLoading ? "Processing..." : "Leave"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
