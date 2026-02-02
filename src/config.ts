const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL ?? 'http://localhost:4100';

export const config = {
  gatewayUrl: GATEWAY_URL,
  authUrl: `${GATEWAY_URL}/api/v1/auth`,
} as const;
