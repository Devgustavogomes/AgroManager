import { useState, type ReactNode } from "react";
import type { AuthResponse } from "../types/auth.type";
import { AuthContext } from "../hooks/useAuth";
import { tokenStorage } from "../store/tokenStorage";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  const signIn = (data: AuthResponse) => {
    setToken(data.accessToken);
    tokenStorage.saveToken(data.accessToken);
  };

  const signOut = () => {
    setToken(null);
    tokenStorage.removeToken();
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
