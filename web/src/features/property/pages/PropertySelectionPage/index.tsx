import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { propertyService } from "../../../../services/property.service";
import { MAX_PROPERTIES } from "../../../../types/property.type";
import { PropertyCard } from "../../components/PropertyCard";
import { CreatePropertyModal } from "../../components/CreatePropertyModal";

function PropertySkeleton() {
  return (
    <div className="bg-surface-paper border border-surface-border rounded-lg p-5 shadow-card animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-surface-border" />
        <div className="flex-1 h-4 bg-surface-border rounded" />
      </div>
      <div className="h-3 bg-surface-border rounded w-2/3 mb-4" />
      <div className="pt-3 border-t border-surface-border grid grid-cols-3 gap-2">
        <div className="h-8 bg-surface-border rounded" />
        <div className="h-8 bg-surface-border rounded" />
        <div className="h-8 bg-surface-border rounded" />
      </div>
    </div>
  );
}

function CreatePropertyCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group w-full bg-surface-paper border-2 border-dashed border-surface-border rounded-lg p-5 shadow-card transition-all duration-200 hover:border-agro-main hover:bg-agro-main/5 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-agro-main flex flex-col items-center justify-center gap-3 min-h-[180px] cursor-pointer"
      aria-label="Criar nova propriedade"
    >
      <div className="w-12 h-12 rounded-full border-2 border-dashed border-surface-border group-hover:border-agro-main bg-surface-base group-hover:bg-agro-main/10 flex items-center justify-center transition-all">
        <svg
          className="w-6 h-6 text-content-secondary group-hover:text-agro-main transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </div>
      <span className="text-sm font-medium text-content-secondary group-hover:text-agro-main transition-colors">
        Nova propriedade
      </span>
    </button>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="text-center max-w-sm">
        <CreatePropertyCard onClick={onCreateClick} />
        <p className="mt-4 text-sm text-content-secondary">
          Você ainda não possui propriedades. <br />
          Crie sua primeira propriedade rural para começar.
        </p>
      </div>
    </div>
  );
}

export function PropertySelectionPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: properties = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: () => propertyService.getAll(),
    retry: 1,
  });

  const propertyCount = properties.length;
  const canCreate = propertyCount < MAX_PROPERTIES;

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-full bg-feedback-error/10 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-feedback-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-content-primary mb-1">
            Falha ao carregar
          </h2>
          <p className="text-sm text-content-secondary">
            Não foi possível carregar suas propriedades. Verifique sua conexão e
            tente novamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-content-primary">
                Suas Propriedades
              </h1>
              <p className="mt-1 text-content-secondary text-sm sm:text-base">
                Selecione uma propriedade para acessar o painel de gestão
              </p>
            </div>

            {/* Contador + badge de limite */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${
                  propertyCount >= MAX_PROPERTIES
                    ? "bg-feedback-warning/10 text-feedback-warning border-feedback-warning/30"
                    : "bg-agro-main/10 text-agro-main border-agro-main/30"
                }`}
                aria-label={`${propertyCount} de ${MAX_PROPERTIES} propriedades utilizadas`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                  />
                </svg>
                {isLoading ? "..." : `${propertyCount}/${MAX_PROPERTIES}`}
              </span>

              {propertyCount >= MAX_PROPERTIES && (
                <span className="text-xs text-feedback-warning font-medium hidden sm:inline">
                  Limite atingido
                </span>
              )}
            </div>
          </div>

          {!isLoading && propertyCount >= MAX_PROPERTIES && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-3 p-3 rounded-lg bg-feedback-warning/10 border border-feedback-warning/30"
            >
              <svg
                className="w-5 h-5 text-feedback-warning flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-feedback-warning">
                  Limite de propriedades atingido
                </p>
                <p className="text-xs text-content-secondary mt-0.5">
                  Cada conta pode ter no máximo {MAX_PROPERTIES} propriedades
                  cadastradas. Para adicionar uma nova, remova uma existente.
                </p>
              </div>
            </div>
          )}
        </div>

        {isLoading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            aria-busy="true"
            aria-label="Carregando propriedades"
          >
            <PropertySkeleton />
            <PropertySkeleton />
            <PropertySkeleton />
          </div>
        )}

        {!isLoading && propertyCount === 0 && (
          <EmptyState onCreateClick={() => setIsModalOpen(true)} />
        )}

        {!isLoading && propertyCount > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => (
              <PropertyCard
                key={property.propertyId}
                property={property}
                onClick={() => navigate(`/${property.slug}/dashboard`)}
              />
            ))}

            {canCreate && (
              <CreatePropertyCard onClick={() => setIsModalOpen(true)} />
            )}
          </div>
        )}
      </div>

      <CreatePropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
