import { config } from '../config';
import type { RegisterRequest, AuthRequest, AuthResponse } from '../types/auth';
import type { UserResponse } from '../types/users';

const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

const saveTokens = (res: AuthResponse) => {
  localStorage.setItem('accessToken', res.accessToken);
  localStorage.setItem('refreshToken', res.refreshToken);
};

function getApiError(err: unknown): { message: string } {
  if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
    return { message: (err as { message: string }).message };
  }
  return { message: 'Unknown error' };
}

export const authApi = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAccessToken();
    const headers = new Headers(options.headers);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    headers.set('Content-Type', 'application/json');

    let response = await fetch(`${config.gatewayUrl}${endpoint}`, { ...options, headers });

    if (response.status === 401) {
      const refreshed = await this.refresh();
      if (refreshed) {
        headers.set('Authorization', `Bearer ${getAccessToken()}`);
        response = await fetch(`${config.gatewayUrl}${endpoint}`, { ...options, headers });
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw getApiError(errorData);
    }
    return response.json();
  },

  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>('/api/v1/users/me');
  },

  async login(data: AuthRequest): Promise<AuthResponse> {
    const res = await fetch(`${config.authUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw getApiError(await res.json().catch(() => ({})));
    const tokens: AuthResponse = await res.json();
    saveTokens(tokens);
    return tokens;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const res = await fetch(`${config.authUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw getApiError(await res.json().catch(() => ({})));
    const tokens: AuthResponse = await res.json();
    saveTokens(tokens);
    return tokens;
  },

  async refresh(): Promise<boolean> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;
    try {
      const response = await fetch(`${config.authUrl}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: refreshToken }),
      });
      if (response.ok) {
        const data: AuthResponse = await response.json();
        saveTokens(data);
        return true;
      }
    } catch (e) {
      console.error('Refresh token error', e);
    }
    this.logout();
    return false;
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};
