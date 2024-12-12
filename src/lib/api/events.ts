import axiosInstance from "@/lib/api/axios-instance";
import {
  CreateEventRequest,
  CreateEventResponse,
  AttendEventRequest,
  AttendEventResponse,
  GetHostEventsResponse,
  GetGuestEventsResponse,
} from "@/lib/api/dtos/event";

export const createEvent = async (data: CreateEventRequest): Promise<CreateEventResponse> => {
  const response = await axiosInstance.post<CreateEventResponse>("/events/hosts", data, {
    withCredentials: true,
  });
  return response.data;
};

export const attendEvent = async (data: AttendEventRequest): Promise<AttendEventResponse> => {
  const response = await axiosInstance.put<AttendEventResponse>("/events/attend", data, {
    withCredentials: true,
  });
  return response.data;
};

export const getHostEvents = async (): Promise<GetHostEventsResponse> => {
  const response = await axiosInstance.get<GetHostEventsResponse>("/events/hosts", {
    withCredentials: true,
  });
  return response.data;
};

export const getGuestEvents = async (): Promise<GetGuestEventsResponse> => {
  const response = await axiosInstance.get<GetGuestEventsResponse>("/events/guests", {
    withCredentials: true,
  });
  return response.data;
};
