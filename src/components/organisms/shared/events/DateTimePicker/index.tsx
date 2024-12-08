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
import { areEqual } from "@/lib/utils/array";

type RecurrencesOption = {
  label: string;
  value: string[];
};

const recurrencesOptions: RecurrencesOption[] = [
  {
    label: "Does not repeat",
    value: [],
  },
  {
    label: "Every day",
    value: ["RRULE:FREQ=DAILY"],
  },
  {
    label: "Every week",
    value: ["RRULE:FREQ=WEEKLY"],
  },
  {
    label: "Every 2 weeks",
    value: ["RRULE:FREQ=WEEKLY;INTERVAL=2"],
  },
  {
    label: "Every month",
    value: ["RRULE:FREQ=MONTHLY"],
  },
  {
    label: "Every year",
    value: ["RRULE:FREQ=YEARLY"],
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
  recurrences: string[];
  onRecurrencesChange: (recurrences: string[]) => void;
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
}

export const DateTimePicker = ({
  startDate = getCurrentYmdDate(new Date()),
  endDate = addDays(getCurrentYmdDate(new Date()), 1),
  onStartDateChange,
  onEndDateChange,
  isAllDay,
  onIsAllDayChange,
  recurrences,
  onRecurrencesChange,
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  onTimezoneChange,
}: DateTimePickerProps): React.JSX.Element => {
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

  const getDuration = (): string => {
    const diff = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours}h`;
  };

  const getRecurrencesLabel = (): string => {
    const option = recurrencesOptions.find((r) => areEqual(r.value, recurrences));
    if (!option) throw new Error("Unsupported recurrences");
    return option.label;
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
              className={cn(
                "flex items-center space-x-2 text-sm",
                getRecurrencesLabel() === "Does not repeat" && "text-muted-foreground",
              )}
            >
              <Repeat className="h-4 w-4" />
              <span>{getRecurrencesLabel() === "Does not repeat" ? "Repeat" : getRecurrencesLabel()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[240px] p-0" align="start">
            <div className="rounded-md bg-popover p-1">
              {recurrencesOptions.map((r) => (
                <Button
                  key={r.label}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start font-normal",
                    recurrences === r.value && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => onRecurrencesChange(r.value)}
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
};
