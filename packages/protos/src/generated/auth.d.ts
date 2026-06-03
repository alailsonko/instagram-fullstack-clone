export interface CreateAccountRequest {
  email: string;
  password: string;
}

export interface CreateAccountResponse {
  success: boolean;
  message: string;
}

export interface VerifyAccountRequest {
  email: string;
  password: string;
}

export interface VerifyAccountResponse {
  verified: boolean;
  message: string;
}

export interface AuthServiceClient {
  CreateAccount(
    request: CreateAccountRequest,
    callback: (error: Error | null, response: CreateAccountResponse) => void,
  ): void;
  VerifyAccount(
    request: VerifyAccountRequest,
    callback: (error: Error | null, response: VerifyAccountResponse) => void,
  ): void;
}
