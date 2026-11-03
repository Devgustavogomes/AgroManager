import type { AuthResponse, LoginCredentials, RegisterPayload, RegisterResponse } from "../types/auth.type";
import { api } from "./api.service";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/producers", payload);
    return response.data;
  },
};
