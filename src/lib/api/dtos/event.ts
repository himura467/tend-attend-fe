import { AttendanceActionType } from "@/lib/types/event/attendance";

interface Event {
  summary: string;
  location: string | null;
  start: string;
  end: string;
  is_all_day: boolean;
  recurrence_list: string[];
  timezone: string;
}

interface EventWithId extends Event {
  id: string;
}

interface Attendance {
  action: AttendanceActionType;
  acted_at: string;
}

interface AttendancesWithUsername {
  username: string;
  attendances: Attendance[];
}

interface AttendanceTimeForecast {
  start: string;
  attended_at: string;
  duration: number;
}

export interface AttendanceTimeForecastsWithUsername {
  username: string;
  attendance_time_forecasts: AttendanceTimeForecast[];
}

export interface CreateEventRequest {
  event: Event;
}

export interface CreateEventResponse {
  error_codes: number[];
}

export interface AttendEventRequest {
  action: AttendanceActionType;
}

export interface AttendEventResponse {
  error_codes: number[];
}

export interface GetAttendanceHistoryResponse {
  attendances_with_username: AttendancesWithUsername;
  error_codes: number[];
}

export interface GetMyEventsResponse {
  events: EventWithId[];
  error_codes: number[];
}

export interface GetFollowingEventsResponse {
  events: EventWithId[];
  error_codes: number[];
}

export interface GetGuestAttendanceStatusResponse {
  attend: boolean;
  error_codes: number[];
}

export interface GetAttendanceTimeForecastsResponse {
  attendance_time_forecasts_with_username: {
    [event_id: string]: {
      [user_id: number]: AttendanceTimeForecastsWithUsername;
    };
  };
  error_codes: number[];
}
