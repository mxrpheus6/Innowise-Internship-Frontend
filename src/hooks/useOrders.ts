import { useEffect, useState, useCallback } from "react";
import { ordersApi } from "../api/orders";
import type { OrderResponse, OrderStatus } from "../types/orders";
import { useAuth } from "../context/AuthContext"; // Импортируем контекст авторизации

// Убрали userId из аргументов хука
export function useOrders(status?: OrderStatus) {
  const { isAuthenticated } = useAuth(); // Проверяем авторизацию через контекст
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    // Если не авторизован - не делаем запрос
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Вызываем API без userId
      const data = await ordersApi.getUserOrders(status);
      setOrders(data);
    } catch (err) {
      setError("Не удалось загрузить заказы");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}
