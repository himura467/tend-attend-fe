import axiosInstance from "@/lib/api/axios-instance";
import { CreateGuestAccountRequest, CreateGuestAccountResponse } from "@/lib/api/dtos/account";

export const createGuestAccount = async (data: CreateGuestAccountRequest): Promise<CreateGuestAccountResponse> => {
  const response = await axiosInstance.post<CreateGuestAccountResponse>("/accounts/guests", data);
  return response.data;
};
