import type {
  CreatePropertyPayload,
  PropertyResponse,
} from "../types/property.type";
import { api } from "./api.service";

export const propertyService = {
  getAll: async (): Promise<PropertyResponse[]> => {
    const response = await api.get<PropertyResponse[]>("/property");
    return response.data;
  },

  getBySlug: async (slug: string): Promise<PropertyResponse> => {
    const response = await api.get<PropertyResponse>(`/property/${slug}`);
    return response.data;
  },

  create: async (payload: CreatePropertyPayload): Promise<PropertyResponse> => {
    const response = await api.post<PropertyResponse>("/property", payload);
    return response.data;
  },
};
