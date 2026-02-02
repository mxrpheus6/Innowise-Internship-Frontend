export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  name: string;
  surname: string;
  birthDate: string;
}