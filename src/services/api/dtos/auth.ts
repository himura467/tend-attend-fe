export interface OAuth2PasswordRequestForm {
  username: string;
  password: string;
}

export interface CreateAuthTokenResponse {
  error_codes: number[];
}
