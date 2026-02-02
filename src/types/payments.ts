export type PaymentStatus = 'NEW' | 'PAID' | 'CANCELLED';

export interface PaymentResponse {
  id: string;
  orderId: string;
  userId: string;
  status: PaymentStatus;
  timestamp: string;
  paymentAmount: number;
}
