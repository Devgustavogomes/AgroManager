import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { useToast } from "../../../hooks/useToast";
import { propertyService } from "../../../services/property.service";
import {
  createPropertySchema,
  type CreatePropertyFormData,
  type CreatePropertyPayload,
} from "../../../types/property.type";

const BRAZIL_STATES = [
  { value: "AC", label: "Acre (AC)" },
  { value: "AL", label: "Alagoas (AL)" },
  { value: "AP", label: "Amapá (AP)" },
  { value: "AM", label: "Amazonas (AM)" },
  { value: "BA", label: "Bahia (BA)" },
  { value: "CE", label: "Ceará (CE)" },
  { value: "DF", label: "Distrito Federal (DF)" },
  { value: "ES", label: "Espírito Santo (ES)" },
  { value: "GO", label: "Goiás (GO)" },
  { value: "MA", label: "Maranhão (MA)" },
  { value: "MT", label: "Mato Grosso (MT)" },
  { value: "MS", label: "Mato Grosso do Sul (MS)" },
  { value: "MG", label: "Minas Gerais (MG)" },
  { value: "PA", label: "Pará (PA)" },
  { value: "PB", label: "Paraíba (PB)" },
  { value: "PR", label: "Paraná (PR)" },
  { value: "PE", label: "Pernambuco (PE)" },
  { value: "PI", label: "Piauí (PI)" },
  { value: "RJ", label: "Rio de Janeiro (RJ)" },
  { value: "RN", label: "Rio Grande do Norte (RN)" },
  { value: "RS", label: "Rio Grande do Sul (RS)" },
  { value: "RO", label: "Rondônia (RO)" },
  { value: "RR", label: "Roraima (RR)" },
  { value: "SC", label: "Santa Catarina (SC)" },
  { value: "SP", label: "São Paulo (SP)" },
  { value: "SE", label: "Sergipe (SE)" },
  { value: "TO", label: "Tocantins (TO)" },
];

interface CreatePropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePropertyModal({
  isOpen,
  onClose,
}: CreatePropertyModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [slugEnabled, setSlugEnabled] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreatePropertyFormData>({
    mode: "onBlur",
    resolver: zodResolver(createPropertySchema),
    defaultValues: {
      arableArea: 0,
      vegetationArea: 0,
    },
  });

  useEffect(() => {
    if (!slugEnabled) {
      setValue("slug", undefined);
    }
  }, [slugEnabled, setValue]);

  useEffect(() => {
    if (!isOpen) {
      reset();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSlugEnabled(false);
    }
  }, [isOpen, reset]);

  const mutation = useMutation({
    mutationFn: async (data: CreatePropertyFormData) => {
      const payload: CreatePropertyPayload = {
        name: data.name,
        city: data.city,
        state: data.state,
        totalArea: data.totalArea,
        arableArea: data.arableArea,
        vegetationArea: data.vegetationArea,
        ...(slugEnabled && data.slug ? { slug: data.slug } : {}),
      };
      return await propertyService.create(payload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast({
        intent: "success",
        message: "Propriedade criada com sucesso!",
      });
      onClose();
    },
    onError: () => {
      toast({
        intent: "danger",
        message:
          "Erro ao criar propriedade. Verifique os dados e tente novamente.",
      });
    },
  });

  const handleCreate = handleSubmit((data) => {
    mutation.mutate(data);
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-property-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-content-primary/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-lg bg-surface-paper rounded-t-2xl sm:rounded-2xl shadow-modal max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface-border sticky top-0 bg-surface-paper rounded-t-2xl sm:rounded-t-2xl z-10">
          <div>
            <h2
              id="create-property-modal-title"
              className="text-lg font-bold text-content-primary"
            >
              Nova Propriedade
            </h2>
            <p className="text-sm text-content-secondary mt-0.5">
              Preencha os dados da sua propriedade rural
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface-base transition-colors"
            aria-label="Fechar modal"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 1L17 17M1 17L17 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCreate} className="p-5 space-y-4">
          {/* Nome */}
          <div>
            <label
              htmlFor="property-name"
              className="block text-sm font-medium text-content-primary mb-1"
            >
              Nome da propriedade <span className="text-feedback-error">*</span>
            </label>
            <Input
              id="property-name"
              {...register("name")}
              placeholder="Ex: Fazenda São João"
              error={errors.name?.message}
            />
          </div>

          {/* Cidade e Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="property-city"
                className="block text-sm font-medium text-content-primary mb-1"
              >
                Cidade <span className="text-feedback-error">*</span>
              </label>
              <Input
                id="property-city"
                {...register("city")}
                placeholder="Ex: Ribeirão Preto"
                error={errors.city?.message}
              />
            </div>
            <div>
              <label
                htmlFor="property-state"
                className="block text-sm font-medium text-content-primary mb-1"
              >
                Estado <span className="text-feedback-error">*</span>
              </label>
              <Controller
                name="state"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    id="property-state"
                    {...field}
                    options={BRAZIL_STATES}
                    placeholder="Selecione..."
                    error={errors.state?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* Áreas */}
          <div>
            <label
              htmlFor="property-total-area"
              className="block text-sm font-medium text-content-primary mb-1"
            >
              Área total (ha) <span className="text-feedback-error">*</span>
            </label>
            <Input
              id="property-total-area"
              type="number"
              step="0.01"
              min="0"
              {...register("totalArea", { valueAsNumber: true })}
              placeholder="Ex: 1500"
              error={errors.totalArea?.message}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="property-arable-area"
                className="block text-sm font-medium text-content-primary mb-1"
              >
                Área agricultável (ha)
              </label>
              <Input
                id="property-arable-area"
                type="number"
                step="0.01"
                min="0"
                {...register("arableArea", { valueAsNumber: true })}
                placeholder="Ex: 800"
                error={errors.arableArea?.message}
              />
            </div>
            <div>
              <label
                htmlFor="property-vegetation-area"
                className="block text-sm font-medium text-content-primary mb-1"
              >
                Área de vegetação (ha)
              </label>
              <Input
                id="property-vegetation-area"
                type="number"
                step="0.01"
                min="0"
                {...register("vegetationArea", { valueAsNumber: true })}
                placeholder="Ex: 200"
                error={errors.vegetationArea?.message}
              />
            </div>
          </div>

          {/* Slug — avançado, opcional */}
          <div className="pt-2 border-t border-surface-border">
            <button
              type="button"
              onClick={() => setSlugEnabled((prev) => !prev)}
              className="flex items-center gap-2 text-sm text-content-secondary hover:text-agro-main transition-colors"
              aria-expanded={slugEnabled}
            >
              <svg
                className={`w-4 h-4 transition-transform ${slugEnabled ? "rotate-90" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
              <span>
                {slugEnabled ? "Ocultar" : "Personalizar"} identificador (slug)
              </span>
            </button>

            {slugEnabled && (
              <div className="mt-3 p-3 bg-surface-base rounded-lg border border-surface-border">
                <div className="flex items-start gap-2 mb-3">
                  <svg
                    className="w-4 h-4 text-content-secondary flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                    />
                  </svg>
                  <p className="text-xs text-content-secondary leading-relaxed">
                    O <strong className="text-content-primary">slug</strong> é o
                    identificador único da sua propriedade nas URLs do sistema
                    (ex:{" "}
                    <code className="bg-surface-border px-1 rounded text-xs font-mono">
                      fazenda-sao-joao
                    </code>
                    ). Use apenas letras minúsculas, números e hifens. Se deixar
                    em branco, será gerado automaticamente a partir do nome.
                  </p>
                </div>
                <label
                  htmlFor="property-slug"
                  className="block text-sm font-medium text-content-primary mb-1"
                >
                  Slug personalizado
                </label>
                <Input
                  id="property-slug"
                  {...register("slug")}
                  placeholder="Ex: fazenda-sao-joao"
                  error={errors.slug?.message}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              intent="secondary"
              className="flex-1"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              intent="primary"
              className="flex-1"
              isLoading={mutation.isPending}
            >
              Criar propriedade
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
