import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { attendEvent, getGuestAttendanceStatus, updateAttendances } from "@/lib/api/events";
import { AttendanceAction, AttendanceActionType } from "@/lib/types/event/attendance";
import { applyTimezone } from "@/lib/utils/timezone";
import { Edit, Plus, Save, Trash2, X } from "lucide-react";
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

  const handleSaveAttendances = async (): Promise<void> => {
    if (!eventId || !eventStartUTC) return;
    setIsLoading(true);
    try {
      const attendancesToSave = editableAttendances
        .filter((attendance) => !attendance.isEditing)
        .map((attendance) => ({
          action: attendance.action,
          acted_at: attendance.acted_at,
        }));
      const response = await updateAttendances(
        { attendances: attendancesToSave },
        eventId,
        eventStartUTC.toISOString(),
      );
      if (response.error_codes.length === 0) {
        toast.success("Attendance records updated successfully");
        setIsEditMode(false);
        if (eventStart && eventEnd) {
          await onAttendanceUpdate(eventId, eventStart, eventEnd);
        }
      } else {
        toast.error("Failed to update attendance records");
      }
    } catch {
      toast.error("Failed to update attendance records");
    } finally {
      setIsLoading(false);
    }
  };

  const addNewAttendance = (): void => {
    const now = new Date();
    // Format to match existing API format: remove milliseconds and Z suffix
    const formattedDateTime = now.toISOString().slice(0, 19);
    const newAttendance: EditableAttendance = {
      action: AttendanceAction.ATTEND,
      acted_at: formattedDateTime,
      isEditing: true,
      isNew: true,
    };
    setEditableAttendances([...editableAttendances, newAttendance]);
  };

  const deleteAttendance = (index: number): void => {
    setEditableAttendances(editableAttendances.filter((_, i) => i !== index));
  };

  const startEditAttendance = (index: number): void => {
    setEditableAttendances(
      editableAttendances.map((attendance, i) => (i === index ? { ...attendance, isEditing: true } : attendance)),
    );
  };

  const cancelEditAttendance = (index: number): void => {
    if (editableAttendances[index].isNew) {
      deleteAttendance(index);
    } else {
      setEditableAttendances(
        editableAttendances.map((attendance, i) => (i === index ? { ...attendance, isEditing: false } : attendance)),
      );
    }
  };

  const saveAttendanceEdit = (index: number): void => {
    setEditableAttendances(
      editableAttendances.map((attendance, i) =>
        i === index ? { ...attendance, isEditing: false, isNew: false } : attendance,
      ),
    );
  };

  const updateAttendanceField = (index: number, field: keyof EditableAttendance, value: string): void => {
    setEditableAttendances(
      editableAttendances.map((attendance, i) => (i === index ? { ...attendance, [field]: value } : attendance)),
    );
  };

  const formatDateForLocalInput = (date: Date, timeZone: string): string => {
    // Apply the target timezone to the date first
    const zonedDate = applyTimezone(date, "UTC", timeZone);
    // Format date for datetime-local input
    // This maintains the actual local time values in the target timezone
    const year = zonedDate.getFullYear();
    const month = (zonedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = zonedDate.getDate().toString().padStart(2, "0");
    const hours = zonedDate.getHours().toString().padStart(2, "0");
    const minutes = zonedDate.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const convertInputDateToUTC = (inputDateTime: string): string => {
    // inputDateTime is in format "2024-05-28T14:30" (datetime-local input)
    // We need to treat this as local time and convert to UTC
    const localDate = new Date(inputDateTime);
    const utcDate = applyTimezone(localDate, Intl.DateTimeFormat().resolvedOptions().timeZone, "UTC");
    // Format to match existing API format: remove milliseconds and Z suffix
    return utcDate.toISOString().slice(0, 19);
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
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Attendance Record</h3>
            <div className="flex gap-2">
              {!isEditMode ? (
                <Button size="sm" variant="outline" onClick={() => setIsEditMode(true)} disabled={!eventId}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              ) : (
                <>
                  <Button size="sm" variant="outline" onClick={addNewAttendance} disabled={isLoading}>
                    <Plus className="h-4 w-4 mr-1" />
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleSaveAttendances}
                    disabled={isLoading || editableAttendances.some((a) => a.isEditing)}
                  >
                    <Save className="h-4 w-4 mr-1" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsEditMode(false);
                      setEditableAttendances(
                        attendances.map((attendance) => ({
                          action: attendance.action as AttendanceActionType,
                          acted_at: attendance.acted_at,
                          isEditing: false,
                          isNew: false,
                        })),
                      );
                    }}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4 mr-1" />
                  </Button>
                </>
              )}
            </div>
          </div>
          <ScrollArea className="h-[200px] rounded-md border p-4">
            {editableAttendances.length > 0 ? (
              editableAttendances
                .sort((a, b) => new Date(a.acted_at).getTime() - new Date(b.acted_at).getTime())
                .map((attendance, index) => (
                  <div key={index} className="mb-2 space-y-2">
                    {attendance.isEditing ? (
                      <div className="space-y-2 p-2 border rounded">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs font-medium">Action</label>
                            <Select
                              value={attendance.action}
                              onValueChange={(value) => updateAttendanceField(index, "action", value)}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={AttendanceAction.ATTEND}>Attend</SelectItem>
                                <SelectItem value={AttendanceAction.LEAVE}>Leave</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs font-medium">Date & Time</label>
                            <Input
                              type="datetime-local"
                              value={formatDateForLocalInput(
                                new Date(attendance.acted_at),
                                Intl.DateTimeFormat().resolvedOptions().timeZone,
                              )}
                              onChange={(e) =>
                                updateAttendanceField(index, "acted_at", convertInputDateToUTC(e.target.value))
                              }
                              className="h-8"
                            />
                          </div>
                        </div>
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" variant="default" onClick={() => saveAttendanceEdit(index)}>
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => cancelEditAttendance(index)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-sm">
                        <span>
                          {applyTimezone(
                            new Date(attendance.acted_at),
                            "UTC",
                            Intl.DateTimeFormat().resolvedOptions().timeZone,
                          ).toLocaleString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={attendance.action === "attend" ? "text-green-600" : "text-red-600"}>
                            {attendance.action === "attend" ? "Attended" : "Left"}
                          </span>
                          {isEditMode && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEditAttendance(index)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteAttendance(index)}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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
