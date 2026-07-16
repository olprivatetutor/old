export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginTokenData {
  access_token: string;
  refresh_token: string;
  token_type: string;
  access_token_expires_in: number;
  refresh_token_expires_in: number;
}

export interface LoginResponse {
  success: true;
  data: LoginTokenData;
}

export type RefreshTokenResponse =
  | {
      success: true;
      data: LoginTokenData;
    }
  | {
      success: false;
      message?: string;
    };
