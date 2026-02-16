import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "react-bootstrap";

const ProtectedRoute = () => {
  const { isAuthenticated, login, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      login();
    }
  }, [isInitialized, isAuthenticated, login]);

  if (!isInitialized || !isAuthenticated) {
    return <Spinner />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
