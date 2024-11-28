export interface CreateEventRequest {
  summary: string;
  location: string | null;
  start: string;
  end: string;
  recurrence_list: string[];
  is_all_day: boolean;
}

export interface CreateEventResponse {
  error_codes: number[];
}
