import type { AuthResponse, LoginCredentials } from "../types/auth.type";
import { api } from "./api.service";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },
};
