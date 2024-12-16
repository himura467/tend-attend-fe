import React from "react";
import { AttendanceStatus, AttendanceStatusType, AttendanceStatusRecord } from "@/lib/types/event/attendance";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface EventAttendanceFormProps {
  eventSummary: string | null;
  onSubmit: (status: AttendanceStatusType) => Promise<void>;
}

export const EventAttendanceForm = ({ eventSummary, onSubmit }: EventAttendanceFormProps): React.JSX.Element => {
  const [status, setStatus] = React.useState<AttendanceStatusType>(AttendanceStatus.PRESENT);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await onSubmit(status);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{eventSummary ? `Attendance for: ${eventSummary}` : "Select an event"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                onValueChange={(value) => setStatus(Number(value) as AttendanceStatusType)}
                defaultValue={status.toString()}
                disabled={!eventSummary}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select attendance status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AttendanceStatusRecord).map(([status, label]) => (
                    <SelectItem key={status} value={status}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardFooter className="px-0">
            <Button type="submit" disabled={!eventSummary}>
              Submit
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};
