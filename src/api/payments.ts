import { authApi } from './auth';
import type { PaymentResponse } from '../types/payments';

export const paymentsApi = {
  async getCurrentUserPayments(
    userId: string,
    statuses?: string[]
  ): Promise<PaymentResponse[]> {
    const params = new URLSearchParams();
    statuses?.forEach((s) => params.append('statuses', s));
    const query = params.toString();
    const endpoint = query
      ? `/api/v1/payments/me?${query}`
      : '/api/v1/payments/me';
    return authApi.request<PaymentResponse[]>(endpoint, {
      headers: { 'X-User-Id': userId },
    });
  },
};
