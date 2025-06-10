import axiosInstance from "@/lib/api/axios-instance";
import { AuthToken, OAuth2PasswordRequestForm } from "@/lib/api/dtos/auth";

export const createAuthToken = async (data: OAuth2PasswordRequestForm): Promise<AuthToken> => {
  const response = await axiosInstance.post<AuthToken>("/auth/tokens/create", data, {
    withCredentials: true,
  });
  return response.data;
};
