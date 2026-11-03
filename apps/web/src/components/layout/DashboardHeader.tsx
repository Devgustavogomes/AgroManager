import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function DashboardHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-surface-paper border-b border-surface-border sticky top-0 z-30 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 -ml-2 text-content-secondary hover:text-content-primary rounded-md focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <Link to="/properties" className="text-xl font-bold text-agro-main">
              AgroManager
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSignOut}
              className="text-content-secondary hover:text-feedback-error font-medium transition-colors cursor-pointer"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
