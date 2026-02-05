import { authApi } from './auth';
import type { OrderResponse, OrderStatus } from '../types/orders';
import { config } from '../config';

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
    const endpoint = `${config.endpoints.orders.me}${params.toString() ? `?${params}` : ''}`;

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