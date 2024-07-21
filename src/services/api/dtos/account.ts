export interface CreateHostAccountRequest {
  email: string;
  password: string;
  host_name: string;
}

export interface CreateHostAccountResponse {
  error_codes: number[];
}
