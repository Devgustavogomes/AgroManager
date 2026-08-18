import axios from "axios";
import { tokenStorage } from "../store/tokenStorage";

export const api = axios.create({
  baseURL: import.meta.env.BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
