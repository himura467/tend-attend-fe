import axiosInstance from "@/lib/api/axios-instance";
import { CreateHostAccountRequest, CreateHostAccountResponse } from "@/lib/api/dtos/account";

export const createHostAccount = async (data: CreateHostAccountRequest): Promise<CreateHostAccountResponse> => {
  const response = await axiosInstance.post<CreateHostAccountResponse>("/accounts/hosts", data);
  return response.data;
};
