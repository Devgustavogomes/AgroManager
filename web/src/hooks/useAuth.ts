import { useContext, createContext } from "react";
import type { AuthResponse } from "../types/auth.type";

export interface AuthContextData {
  token: AuthResponse["accessToken"] | null;
  isAuthenticated: boolean;
  signIn: (data: AuthResponse) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextData | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth should be used inside an AuthProvider.");
  }

  return context;
}
