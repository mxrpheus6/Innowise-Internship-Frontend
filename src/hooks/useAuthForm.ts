import { useAuth } from "../context/AuthContext";

export function useAuthForm() {
  const { login } = useAuth();

  const handleLogin = () => {
    login();
  };

  const handleRegister = () => {
    login();
  };

  return {
    handleLogin,
    handleRegister,
  };
}
