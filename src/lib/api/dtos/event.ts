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

export interface GetMyEventsResponse {
  events: EventWithId[];
  error_codes: number[];
}

export interface GetFollowingEventsResponse {
  events: EventWithId[];
  error_codes: number[];
}

export interface GetGuestCurrentAttendanceStatusResponse {
  attend: boolean;
  error_codes: number[];
}
