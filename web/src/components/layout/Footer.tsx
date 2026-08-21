export function Footer() {
  return (
    <footer className="bg-surface-paper border-t border-surface-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <span className="text-lg font-bold text-agro-main">AgroManager</span>
            <p className="text-sm text-content-secondary mt-1">
              Gerenciamento inteligente para o agronegócio.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-content-secondary">
            <a href="#" className="hover:text-agro-main transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-agro-main transition-colors">Privacidade</a>
            <a href="#" className="hover:text-agro-main transition-colors">Contato</a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-surface-border text-center text-sm text-content-secondary">
          &copy; {new Date().getFullYear()} AgroManager. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
