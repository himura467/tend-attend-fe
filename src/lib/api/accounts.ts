import axiosInstance from "@/lib/api/axiosInstance";
import { CreateUserAccountRequest, CreateUserAccountResponse } from "@/lib/api/dtos/account";

export const createUserAccount = async (data: CreateUserAccountRequest): Promise<CreateUserAccountResponse> => {
  const response = await axiosInstance.post<CreateUserAccountResponse>("/accounts/create", data);
  return response.data;
};
