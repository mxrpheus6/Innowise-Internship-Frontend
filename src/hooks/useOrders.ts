import { useEffect, useState, useCallback } from 'react';
import { ordersApi } from '../api/orders';
import type { OrderResponse, OrderStatus } from '../types/orders';

export function useOrders(userId: string | null, status?: OrderStatus) {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await ordersApi.getUserOrders(userId, status);
      setOrders(data);
    } catch (err) {
      setError('Не удалось загрузить заказы');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId, status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}