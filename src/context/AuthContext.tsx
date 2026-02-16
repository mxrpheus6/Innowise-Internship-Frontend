import { createContext, useContext, useEffect, useState, useRef } from "react";
import keycloak from "../lib/keycloak";
import { Spinner } from "react-bootstrap";

type AuthContextValue = {
  isAuthenticated: boolean;
  token: string | null;
  logout: () => void;
  login: () => void;
  isInitialized: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const isRun = useRef(false);

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    keycloak
      .init({
        onLoad: "check-sso",
        pkceMethod: "S256",
      })
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        setToken(keycloak.token || null);
        setIsInitialized(true);
      })
      .catch((err) => {
        console.error("Keycloak init failed", err);
        setIsInitialized(true);
      });
  }, []);

  const login = () => {
    keycloak.login({
      redirectUri: `${window.location.origin}/profile`,
    });
  };
  const logout = () => {
    keycloak.logout({
      redirectUri: `${window.location.origin}/login`,
    });
  };

  const value = {
    isAuthenticated,
    token,
    login,
    logout,
    isInitialized,
  };

  if (!isInitialized) {
    return <Spinner />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
