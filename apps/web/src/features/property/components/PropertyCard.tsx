import type { PropertyResponse } from "../../../types/property.type";

interface PropertyCardProps {
  property: PropertyResponse;
  onClick: () => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  return (
    <article
      className="group bg-surface-paper border border-surface-border rounded-lg p-5 shadow-card cursor-pointer transition-all duration-200 hover:border-agro-main hover:shadow-modal hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-agro-main"
      role="button"
      tabIndex={0}
      aria-label={`Selecionar propriedade ${property.name}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-agro-main/10 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-agro-main"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-content-primary text-base truncate group-hover:text-agro-main transition-colors">
            {property.name}
          </h3>
        </div>
        <svg
          className="flex-shrink-0 w-4 h-4 text-content-secondary group-hover:text-agro-main transition-colors mt-0.5"
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
      </div>

      <div className="flex items-center gap-1.5 text-sm text-content-secondary mb-4">
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>
        <span className="truncate">
          {property.city}, {property.state}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-surface-border">
        <div className="text-center">
          <p className="text-xs text-content-secondary mb-0.5">Total</p>
          <p className="text-sm font-semibold text-content-primary">
            {property.totalArea.toLocaleString("pt-BR")} ha
          </p>
        </div>
        <div className="text-center border-x border-surface-border">
          <p className="text-xs text-content-secondary mb-0.5">Agricultável</p>
          <p className="text-sm font-semibold text-agro-main">
            {property.arableArea.toLocaleString("pt-BR")} ha
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-content-secondary mb-0.5">Vegetação</p>
          <p className="text-sm font-semibold text-content-primary">
            {property.vegetationArea.toLocaleString("pt-BR")} ha
          </p>
        </div>
      </div>
    </article>
  );
}
