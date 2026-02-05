const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL ?? 'http://localhost:4100';
const AUTH_URL = import.meta.env.VITE_AUTH_URL ?? `${GATEWAY_URL}/api/v1/auth`;

export const config = {
  gatewayUrl: GATEWAY_URL,
  authUrl: AUTH_URL,
  endpoints: {
    auth: {
      login: '/login',
      register: '/register',
      refresh: '/refresh',
    },
    user: {
      me: '/api/v1/users/me',
    },
    items: {
      base: '/api/v1/items',
    },
    orders: {
      me: '/api/v1/orders/me',
    },
    payments: {
      me: '/api/v1/payments/me',
    },
  },
} as const;