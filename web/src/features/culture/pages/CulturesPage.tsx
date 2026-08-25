export function CulturesPage() {
  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
      <div className="bg-surface-paper border border-surface-border rounded-lg p-8 shadow-card text-center">
        <div className="w-16 h-16 rounded-full bg-agro-main/10 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-agro-main"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-content-primary mb-2">
          Culturas em Construção
        </h2>
        <p className="text-content-secondary max-w-md mx-auto">
          Esta tela será o painel de gestão das culturas plantadas.
        </p>
      </div>
    </div>
  );
}
