interface Event {
  summary: string;
  location: string | null;
  start: string;
  end: string;
  recurrence_list: string[];
  is_all_day: boolean;
}

export interface CreateEventRequest {
  event: Event;
}

export interface CreateEventResponse {
  error_codes: number[];
}

export interface GetHostEventsResponse {
  events: Event[];
  error_codes: number[];
}
