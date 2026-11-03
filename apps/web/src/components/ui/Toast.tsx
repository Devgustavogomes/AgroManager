import { useEffect, useRef } from "react";

type ToastIntent = "success" | "danger" | "warning";

interface ToastProps {
  message: string;
  intent?: ToastIntent;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

const intentStyles: Record<
  ToastIntent,
  { border: string; icon: string; text: string }
> = {
  success: {
    border: "border-feedback-success",
    icon: "✓",
    text: "text-feedback-success",
  },
  danger: {
    border: "border-feedback-error",
    icon: "✕",
    text: "text-feedback-error",
  },
  warning: {
    border: "border-feedback-warning",
    icon: "⚠",
    text: "text-feedback-warning",
  },
};

const intentProgressColor: Record<ToastIntent, string> = {
  success: "bg-feedback-success",
  danger: "bg-feedback-error",
  warning: "bg-feedback-warning",
};

export function Toast({
  message,
  intent = "danger",
  visible,
  onClose,
  duration = 4000,
}: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const styles = intentStyles[intent];

  useEffect(() => {
    if (!visible) return;

    timerRef.current = setTimeout(onClose, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, duration, onClose]);

  if (!visible) return null;

  return (
    <div
      role="alert"
      className={`
        fixed top-4 right-4 z-50
        flex items-center gap-3
        w-80 p-4 rounded-lg border-l-4
        shadow-modal bg-surface-paper
        ${styles.border}
        animate-slide-in
      `}
    >
      <span className={`flex-shrink-0 text-lg font-bold ${styles.text}`}>
        {styles.icon}
      </span>

      <p className="flex-1 text-sm text-content-primary">{message}</p>

      <button
        onClick={onClose}
        className="flex-shrink-0 text-content-secondary hover:text-content-primary transition-colors p-0.5 rounded hover:bg-surface-border/50"
        aria-label="Fechar notificação"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M1 1L13 13M1 13L13 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-surface-border/30">
        <div
          className={`h-full ${intentProgressColor[intent]} rounded-full`}
          style={{ animation: `toast-progress ${duration}ms linear forwards` }}
        />
      </div>

      <style>{`
        @keyframes toast-slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-slide-in {
          animation: toast-slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

