import axiosInstance from "@/lib/api/axios-instance";
import { CreateHostAccountRequest, CreateHostAccountResponse } from "@/lib/api/dtos/account";
import { OAuth2PasswordRequestForm, AuthToken } from "@/lib/api/dtos/auth";

export const createHostAccount = async (data: CreateHostAccountRequest): Promise<CreateHostAccountResponse> => {
  const response = await axiosInstance.post<CreateHostAccountResponse>("/accounts/hosts", data);
  return response.data;
};

export const createAuthToken = async (data: OAuth2PasswordRequestForm): Promise<AuthToken> => {
  const response = await axiosInstance.post<AuthToken>("/auth/token", data, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    withCredentials: true,
  });
  return response.data;
};
