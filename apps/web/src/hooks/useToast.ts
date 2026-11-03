import { useContext, createContext } from "react";

type ToastIntent = "success" | "danger" | "warning";

export interface ToastData {
  message: string;
  intent?: ToastIntent;
  duration?: number;
}

export interface ToastContextData {
  toast: (data: ToastData) => void;
}

export const ToastContext = createContext<ToastContextData | null>(null);

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast should be used inside a ToastProvider.");
  }

  return context;
}
