import { useEffect, useState, useCallback, useRef } from "react";
import { ordersApi } from "../api/orders";
import type { OrderResponse, OrderStatus } from "../types/orders";
import { useAuth } from "../context/AuthContext";

export function useOrders(status?: OrderStatus, pollingInterval: number = 0) {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchOrders = useCallback(
    async (isBackground = false) => {
      if (!isAuthenticated) {
        if (isMounted.current) setLoading(false);
        return;
      }

      if (!isBackground) {
        setLoading(true);
      }

      if (!isBackground) setError(null);

      try {
        const data = await ordersApi.getUserOrders(status);
        if (isMounted.current) {
          setOrders(data);
        }
      } catch (err) {
        console.error(err);
        if (isMounted.current && !isBackground) {
          setError("Не удалось загрузить заказы");
        }
      } finally {
        if (isMounted.current && !isBackground) {
          setLoading(false);
        }
      }
    },
    [isAuthenticated, status],
  );

  useEffect(() => {
    fetchOrders(false);
  }, [fetchOrders]);

  useEffect(() => {
    if (pollingInterval <= 0 || !isAuthenticated) return;

    const hasActiveOrders = orders.some((order) => order.status === "NEW");

    if (!loading && orders.length > 0 && !hasActiveOrders) {
      return;
    }

    const intervalId = setInterval(() => {
      fetchOrders(true);
    }, pollingInterval);

    return () => clearInterval(intervalId);
  }, [pollingInterval, isAuthenticated, orders, loading, fetchOrders]);

  return { orders, loading, error, refetch: () => fetchOrders(false) };
}
