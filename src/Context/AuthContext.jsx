import { createContext, useContext, useEffect, useState } from "react";
import apiFetch from "../Utils/apiFetch";
import { API_ENDPOINTS } from "../Config/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  /* ---------------- AUTH BOOTSTRAP ---------------- */
  useEffect(() => {
    const path = window.location.pathname;

    // 🚫 Login page – skip bootstrap check
    if (path === "/login") {
      setIsAuthenticated(false);
      setAuthChecked(true);
      return;
    }

    // 🔑 ALWAYS ask backend
    verifyAuth();
  }, []);

  const verifyAuth = async () => {
    try {
      await apiFetch(API_ENDPOINTS.API_ME, {
        skipAuthRefresh: true,
      });
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthChecked(true);
    }
  };

  /* ---------------- CROSS TAB LOGOUT ---------------- */
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === "logout-event") {
        setIsAuthenticated(false);
        setAuthChecked(true);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* ---------------- LOGIN ---------------- */
  const login = () => {
    setIsAuthenticated(true);
    setAuthChecked(true);
    localStorage.removeItem("logout-event");
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = async () => {
    try {
      await apiFetch(API_ENDPOINTS.API_LOGOUT, {
        method: "POST",
        skipAuthRefresh: true,
      });
    } catch {
      // ignore
    }

    setIsAuthenticated(false);
    setAuthChecked(true);
    localStorage.setItem("logout-event", Date.now().toString());
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, authChecked, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
