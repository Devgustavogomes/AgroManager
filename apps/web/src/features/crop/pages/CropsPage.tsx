export function CropsPage() {
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
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-content-primary mb-2">
          Lavouras em Construção
        </h2>
        <p className="text-content-secondary max-w-md mx-auto">
          Esta tela será o painel de gestão das suas lavouras e safras.
        </p>
      </div>
    </div>
  );
}
