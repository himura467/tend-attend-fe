import { addDays, format } from "date-fns";
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, Clock, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentYmdDate } from "@/lib/utils/date";

type RecurrenceOption = {
  label: string;
  value: string;
};

const recurrenceOptions: RecurrenceOption[] = [
  {
    label: "Does not repeat",
    value: "",
  },
  {
    label: "Every day",
    value: "RRULE:FREQ=DAILY",
  },
  {
    label: "Every week",
    value: "RRULE:FREQ=WEEKLY",
  },
  {
    label: "Every 2 weeks",
    value: "RRULE:FREQ=WEEKLY;INTERVAL=2",
  },
  {
    label: "Every month",
    value: "RRULE:FREQ=MONTHLY",
  },
  {
    label: "Every year",
    value: "RRULE:FREQ=YEARLY",
  },
];

type TimezoneOption = {
  label: string;
  value: string;
};

const timezoneOptions: TimezoneOption[] = [
  {
    label: "UTC",
    value: "UTC",
  },
  {
    label: "Tokyo",
    value: "Asia/Tokyo",
  },
];

interface DateTimePickerProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  isAllDay: boolean;
  onIsAllDayChange: (isAllDay: boolean) => void;
  recurrence?: string | null;
  onRecurrenceChange: (recurrence: string | null) => void;
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
}

export default function DateTimePicker({
  startDate = getCurrentYmdDate(new Date()),
  endDate = addDays(getCurrentYmdDate(new Date()), 1),
  onStartDateChange,
  onEndDateChange,
  isAllDay,
  onIsAllDayChange,
  recurrence,
  onRecurrenceChange,
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  onTimezoneChange,
}: DateTimePickerProps) {
  const timeOptions = React.useMemo(() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (const minute of [0, 15, 30, 45]) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        options.push(time);
      }
    }
    return options;
  }, []);

  const getDuration = () => {
    const diff = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours}h`;
  };

  const getRecurrenceLabel = () => {
    if (!recurrence) return null;
    const option = recurrenceOptions.find((r) => r.value === recurrence);
    return option && option.value != "" ? option.label : null;
  };

  return (
    <div className="flex flex-col space-y-4 rounded-lg border p-4">
      {!isAllDay && (
        <div className="flex items-center space-x-4">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[120px] justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                >
                  {format(startDate, "HH:mm")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <div className="h-60 overflow-y-auto">
                  {timeOptions.map((time) => (
                    <Button
                      key={time}
                      variant="ghost"
                      className="w-full justify-start font-normal"
                      onClick={() => {
                        const [hours, minutes] = time.split(":").map(Number);
                        const newDate = new Date(startDate);
                        newDate.setHours(hours, minutes);
                        onStartDateChange(newDate);
                      }}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <span className="text-muted-foreground">→</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[120px] justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                >
                  {format(endDate, "HH:mm")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <div className="h-60 overflow-y-auto">
                  {timeOptions.map((time) => (
                    <Button
                      key={time}
                      variant="ghost"
                      className="w-full justify-start font-normal"
                      onClick={() => {
                        const [hours, minutes] = time.split(":").map(Number);
                        const newDate = new Date(endDate);
                        newDate.setHours(hours, minutes);
                        onEndDateChange(newDate);
                      }}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <span className="text-muted-foreground">{getDuration()}</span>
          </div>
        </div>
      )}
      <div className="flex items-center space-x-4">
        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-[150px] justify-start text-left font-normal", !startDate && "text-muted-foreground")}
              >
                {format(startDate, "EEE MMM dd")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && onStartDateChange(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <span className="text-muted-foreground">→</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-[150px] justify-start text-left font-normal", !endDate && "text-muted-foreground")}
              >
                {format(endDate, "EEE MMM dd")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date && onEndDateChange(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex items-center space-x-8 pt-4">
        <div className="flex items-center space-x-2">
          <Switch id="all-day" checked={isAllDay} onCheckedChange={onIsAllDayChange} />
          <label htmlFor="all-day" className="text-sm text-muted-foreground">
            All-day
          </label>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn("flex items-center space-x-2 text-sm", !getRecurrenceLabel() && "text-muted-foreground")}
            >
              <Repeat className="h-4 w-4" />
              <span>{getRecurrenceLabel() ?? "Repeat"}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[240px] p-0" align="start">
            <div className="rounded-md bg-popover p-1">
              {recurrenceOptions.map((r) => (
                <Button
                  key={r.value}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start font-normal",
                    recurrence === r.value && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => onRecurrenceChange(r.value)}
                >
                  <span className="flex flex-col items-start">
                    <span>{r.label}</span>
                  </span>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        {!isAllDay && (
          <Select value={timezone} onValueChange={onTimezoneChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {timezoneOptions.map((tz) => (
                <SelectItem key={tz.label} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
