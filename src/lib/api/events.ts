import axiosInstance from "@/lib/api/axios-instance";
import {
  CreateEventRequest,
  CreateEventResponse,
  AttendEventRequest,
  AttendEventResponse,
  GetMyEventsResponse,
  GetFollowingEventsResponse,
  GetGuestCurrentAttendanceStatusResponse,
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

export const getGuestCurrentAttendanceStatus = async (
  eventId: string,
  start: string,
): Promise<GetGuestCurrentAttendanceStatusResponse> => {
  const response = await axiosInstance.get<GetGuestCurrentAttendanceStatusResponse>(
    `/events/attend/current/${eventId}/${start}`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};
