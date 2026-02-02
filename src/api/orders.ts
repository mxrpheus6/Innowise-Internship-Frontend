import { authApi } from './auth';
import type { OrderResponse, OrderStatus } from '../types/orders';

export interface CreateOrderRequest {
  orderItems: {
    itemId: string;
    quantity: number;
  }[];
}

export const ordersApi = {
  async getUserOrders(userId: string, status?: OrderStatus): Promise<OrderResponse[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    const query = params.toString();
    const endpoint = query ? `/api/v1/orders/me?${query}` : '/api/v1/orders/me';

    return authApi.request<OrderResponse[]>(endpoint, {
      headers: { 'X-User-Id': userId },
    });
  },

  async getOrderById(userId: string, orderId: string): Promise<OrderResponse> {
    return authApi.request<OrderResponse>(`/api/v1/orders/me/${orderId}`, {
      headers: { 'X-User-Id': userId },
    });
  },

  async createOrder(data: CreateOrderRequest): Promise<OrderResponse> {
    return authApi.request<OrderResponse>('/api/v1/orders/me', {
          method: 'POST',
          body: JSON.stringify(data),
        });
  }
};