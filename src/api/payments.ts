import { authApi } from './auth';
import type { PaymentResponse } from '../types/payments';
import { config } from '../config';

export const paymentsApi = {
  async getCurrentUserPayments(userId: string, statuses?: string[]): Promise<PaymentResponse[]> {
    const params = new URLSearchParams();
    statuses?.forEach((s) => params.append('statuses', s));
    const endpoint = `${config.endpoints.payments.me}${params.toString() ? `?${params}` : ''}`;
    
    return authApi.request<PaymentResponse[]>(endpoint, {
      headers: { 'X-User-Id': userId },
    });
  },
};