import { useEffect, useState, useCallback } from 'react';
import { paymentsApi } from '../api/payments';
import type { PaymentResponse } from '../types/payments';

export function usePayments(userId: string | null, statuses?: string[]) {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await paymentsApi.getCurrentUserPayments(userId, statuses);
      setPayments(data);
    } catch (err) {
      setError('Не удалось загрузить платежи');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId, statuses?.join(',')]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { payments, loading, error, refetch: fetchPayments };
}
