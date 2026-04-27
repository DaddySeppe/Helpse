import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { getUserAccess } from "../utils/access";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshMe() {
    const token = localStorage.getItem("helpse_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch (error) {
      localStorage.removeItem("helpse_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshMe();
  }, []);

  async function login(values) {
    const { data } = await api.post("/auth/login", values);
    localStorage.setItem("helpse_token", data.token);
    setUser(data.user);
  }

  async function register(values) {
    const { data } = await api.post("/auth/register", values);
    localStorage.setItem("helpse_token", data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("helpse_token");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      refreshMe,
      access: getUserAccess(user),
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth moet binnen AuthProvider gebruikt worden.");
  }
  return context;
}
