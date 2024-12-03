import axiosInstance from "@/lib/api/axios-instance";
import { CreateEventRequest, CreateEventResponse, GetHostEventsResponse } from "@/lib/api/dtos/event";

export const createEvent = async (data: CreateEventRequest): Promise<CreateEventResponse> => {
  const response = await axiosInstance.post<CreateEventResponse>("/events/hosts", data, {
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
