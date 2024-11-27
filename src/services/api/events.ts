import axiosInstance from "@/services/api/axios-instance";
import { CreateEventRequest, CreateEventResponse } from "@/services/api/dtos/event";

export const createEvent = async (data: CreateEventRequest): Promise<CreateEventResponse> => {
  const response = await axiosInstance.post<CreateEventResponse>("/events/", data, {
    withCredentials: true,
  });
  return response.data;
};
