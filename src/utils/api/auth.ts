import axios, { AxiosResponse } from "axios";
import { API_URL, ResponseWithErrorCodes } from "@/utils/api/base";

interface CreateAccountResponse extends ResponseWithErrorCodes {}

interface LoginResponse extends ResponseWithErrorCodes {}

export const createAccount = async (
  loginId: string,
  loginPassword: string,
  group: string,
): Promise<CreateAccountResponse> => {
  const response: AxiosResponse<CreateAccountResponse> = await axios.post(`${API_URL}/account`, {
    login_id: loginId,
    login_password: loginPassword,
    group: group,
  });
  return response.data;
};

export const login = async (loginId: string, loginPassword: string): Promise<LoginResponse> => {
  const response: AxiosResponse<LoginResponse> = await axios.post(
    `${API_URL}/token`,
    new URLSearchParams({
      username: loginId,
      password: loginPassword,
    }),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      withCredentials: true,
    },
  );
  return response.data;
};
