import { useCallback, useState, type ReactNode } from "react";
import { ToastContext, type ToastData } from "../hooks/useToast";
import { Toast } from "../components/ui/Toast";

interface ToastState extends Required<Pick<ToastData, "message" | "intent">> {
  duration: number;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<ToastState | null>(null);
  const [visible, setVisible] = useState(false);

  const toast = useCallback((data: ToastData) => {
    setCurrent({
      message: data.message,
      intent: data.intent ?? "danger",
      duration: data.duration ?? 4000,
    });
    setVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {current && (
        <Toast
          message={current.message}
          intent={current.intent}
          duration={current.duration}
          visible={visible}
          onClose={handleClose}
        />
      )}
    </ToastContext.Provider>
  );
}
