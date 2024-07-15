import axios, { AxiosResponse } from "axios";
import { API_URL, ResponseWithErrorCodes } from "@/utils/api/base";

interface CreateAccountResponse extends ResponseWithErrorCodes {}

interface LoginResponse extends ResponseWithErrorCodes {}

const instance = axios.create({ baseURL: API_URL });

export const createAccount = async (
  loginId: string,
  loginPassword: string,
  group: number,
): Promise<CreateAccountResponse> => {
  const response: AxiosResponse<CreateAccountResponse> = await instance.post(`/auth/account`, {
    login_id: loginId,
    login_password: loginPassword,
    group: group,
  });
  return response.data;
};

export const login = async (loginId: string, loginPassword: string): Promise<LoginResponse> => {
  const response: AxiosResponse<LoginResponse> = await instance.post(
    `/auth/token`,
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
