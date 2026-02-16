import { authApi } from "./auth";
import type { OrderResponse, OrderStatus } from "../types/orders";
import { config } from "../config";
import type { CreateOrderRequest } from "../types/orders";

export const ordersApi = {
  async getUserOrders(status?: OrderStatus): Promise<OrderResponse[]> {
    const params = new URLSearchParams();
    if (status) params.append("status", status);

    const endpoint = `${config.endpoints.orders.me}${params.toString() ? `?${params}` : ""}`;

    return authApi.request<OrderResponse[]>(endpoint, {});
  },

  async getOrderById(orderId: string): Promise<OrderResponse> {
    return authApi.request<OrderResponse>(`/api/v1/orders/me/${orderId}`);
  },

  async createOrder(data: CreateOrderRequest): Promise<OrderResponse> {
    return authApi.request<OrderResponse>("/api/v1/orders/me", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
