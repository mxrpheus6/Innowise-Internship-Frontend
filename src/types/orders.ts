export type OrderStatus = 'NEW' | 'PAID' | 'CANCELLED';

export interface ItemResponse {
  id: string;
  name: string;
  price: number;
}

export interface OrderItemResponse {
  item: ItemResponse;
  quantity: number;
}

export interface OrderResponse {
  id: string;
  status: OrderStatus;
  creationDate: string;
  items: OrderItemResponse[];
}