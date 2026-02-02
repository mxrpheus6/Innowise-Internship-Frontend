import { useEffect, useState, useCallback } from 'react';
import { authApi } from '../api/auth';
import type { UserResponse } from '../types/users';

export function useProfile() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.getCurrentUser();
      setUser(data);
    } catch (err) {
      setError('Не удалось загрузить данные профиля');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { user, loading, error };
}
