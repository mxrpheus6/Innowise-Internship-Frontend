import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes';
import type { RegisterRequest } from '../types/auth';

const INITIAL_FORM: RegisterRequest = {
  email: '',
  password: '',
  name: '',
  surname: '',
  birthDate: '',
};

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  return 'Ошибка сервера. Попробуйте позже.';
}

export function useAuthForm() {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegisterRequest>(INITIAL_FORM);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.stopPropagation();
        setValidated(true);
        return;
      }
      setLoading(true);
      try {
        const tokens = isLogin
          ? await authApi.login({ email: formData.email, password: formData.password })
          : await authApi.register(formData);
        setToken(tokens.accessToken);
        navigate(ROUTES.PROFILE, { replace: true });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [isLogin, formData, setToken, navigate]
  );

  const toggleAuthMode = useCallback(() => {
    setIsLogin((prev) => !prev);
    setValidated(false);
    setError(null);
  }, []);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return {
    isLogin,
    validated,
    showPassword,
    loading,
    error,
    formData,
    handleChange,
    handleSubmit,
    toggleAuthMode,
    toggleShowPassword,
  };
}
