import z from "zod";

export const MAX_PROPERTIES = 5;

export const createPropertySchema = z
  .object({
    name: z
      .string()
      .min(3, "O nome deve ter no mínimo 3 caracteres.")
      .max(156, "O nome deve ter no máximo 156 caracteres.")
      .trim(),
    slug: z
      .string()
      .min(3, "O slug deve ter no mínimo 3 caracteres.")
      .max(156, "O slug deve ter no máximo 156 caracteres.")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "O slug deve conter apenas letras minúsculas, números e hifens.",
      )
      .trim()
      .optional(),
    city: z
      .string()
      .min(3, "A cidade deve ter no mínimo 3 caracteres.")
      .max(256, "A cidade deve ter no máximo 256 caracteres.")
      .trim(),
    state: z.string().min(2, "Selecione um estado.").max(2).trim(),
    totalArea: z
      .number("A área total é obrigatória.")
      .positive("A área total deve ser um valor positivo."),
    arableArea: z.number().min(0).optional(),
    vegetationArea: z.number().min(0).optional(),
  })
  .refine(
    (data) => {
      const arable = data.arableArea ?? 0;
      const vegetation = data.vegetationArea ?? 0;
      return arable + vegetation <= data.totalArea;
    },
    {
      message:
        "A soma das áreas agricultável e de vegetação não pode exceder a área total.",
      path: ["arableArea"],
    },
  );

export type CreatePropertyFormData = z.infer<typeof createPropertySchema>;

export type CreatePropertyPayload = Omit<CreatePropertyFormData, "slug"> & {
  slug?: string;
};

export interface PropertyResponse {
  name: string;
  slug: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  propertyId: string;
  producerId: string;
  createdAt: string;
  updatedAt: string | null;
}
