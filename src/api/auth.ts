import { config } from "../config";
import type { UserResponse } from "../types/users";
import keycloak from "../lib/keycloak";

function getApiError(err: unknown): { message: string } {
  if (
    err &&
    typeof err === "object" &&
    "message" in err &&
    typeof (err as { message: unknown }).message === "string"
  ) {
    return { message: (err as { message: string }).message };
  }
  return { message: "Unknown error" };
}

export const authApi = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!keycloak.authenticated) {
      throw new Error("User is not authenticated");
    }

    try {
      await keycloak.updateToken(30);
    } catch (error) {
      console.error("Failed to refresh token", error);
      keycloak.login();
      throw new Error("Session expired");
    }

    if (!keycloak.authenticated || !keycloak.token) {
      console.error("No token found!");
      throw new Error("User is not authenticated");
    }

    const headers = new Headers(options.headers);
    if (keycloak.token) {
      headers.set("Authorization", `Bearer ${keycloak.token}`);
    }
    headers.set("Content-Type", "application/json");

    const url = `${config.gatewayUrl}${endpoint}`;
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      throw getApiError(errorData);
    }
    return response.json();
  },

  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>(config.endpoints.user.me);
  },

  logout() {
    return keycloak.logout({ redirectUri: window.location.origin });
  },

  login() {
    return keycloak.login();
  },
};
