import axiosInstance from "@/lib/api/axios-instance";
import {
  AttendEventRequest,
  AttendEventResponse,
  CreateEventRequest,
  CreateEventResponse,
  GetAttendanceHistoryResponse,
  GetAttendanceTimeForecastsResponse,
  GetFollowingEventsResponse,
  GetGuestAttendanceStatusResponse,
  GetMyEventsResponse,
  UpdateAttendancesRequest,
  UpdateAttendancesResponse,
} from "@/lib/api/dtos/event";

export const createEvent = async (data: CreateEventRequest): Promise<CreateEventResponse> => {
  const response = await axiosInstance.post<CreateEventResponse>("/events/create", data, {
    withCredentials: true,
  });
  return response.data;
};

export const attendEvent = async (
  data: AttendEventRequest,
  eventId: string,
  start: string,
): Promise<AttendEventResponse> => {
  const response = await axiosInstance.post<AttendEventResponse>(`/events/attend/${eventId}/${start}`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const updateAttendances = async (
  data: UpdateAttendancesRequest,
  eventId: string,
  start: string,
): Promise<UpdateAttendancesResponse> => {
  const response = await axiosInstance.put<UpdateAttendancesResponse>(`/events/attend/${eventId}/${start}`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const getAttendanceHistory = async (eventId: string, start: string): Promise<GetAttendanceHistoryResponse> => {
  const response = await axiosInstance.get<GetAttendanceHistoryResponse>(`/events/attend/${eventId}/${start}`, {
    withCredentials: true,
  });
  return response.data;
};

export const getMyEvents = async (): Promise<GetMyEventsResponse> => {
  const response = await axiosInstance.get<GetMyEventsResponse>("/events/mine", {
    withCredentials: true,
  });
  return response.data;
};

export const getFollowingEvents = async (): Promise<GetFollowingEventsResponse> => {
  const response = await axiosInstance.get<GetFollowingEventsResponse>("/events/following", {
    withCredentials: true,
  });
  return response.data;
};

export const getGuestAttendanceStatus = async (
  eventId: string,
  start: string,
): Promise<GetGuestAttendanceStatusResponse> => {
  const response = await axiosInstance.get<GetGuestAttendanceStatusResponse>(
    `/events/attend/status/${eventId}/${start}`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

export const getAttendanceTimeForecasts = async (): Promise<GetAttendanceTimeForecastsResponse> => {
  const response = await axiosInstance.get<GetAttendanceTimeForecastsResponse>(`/events/attend/forecast`, {
    withCredentials: true,
  });
  return response.data;
};
