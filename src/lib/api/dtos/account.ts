export interface CreateHostAccountRequest {
  host_name: string;
  password: string;
  email: string;
}

export interface CreateHostAccountResponse {
  error_codes: number[];
}
