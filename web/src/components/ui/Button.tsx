import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { BaseUIProps, UIIntent } from "../../types/design.type";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, BaseUIProps {
  children: ReactNode;
  isLoading?: boolean;
}

const intentStyles: Record<UIIntent, string> = {
  primary: "bg-agro-main text-white hover:bg-agro-dark",
  secondary: "bg-surface-border text-content-primary hover:bg-gray-300",
  success: "bg-feedback-success text-white hover:bg-green-600",
  danger: "bg-feedback-error text-white hover:bg-red-600",
  warning: "bg-feedback-warning text-white hover:bg-yellow-600",
};

export function Button({
  children,
  intent = "primary",
  isLoading = false,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded p-2 font-medium transition-colors disabled:opacity-50 flex justify-center items-center ${intentStyles[intent]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? "Carregando..." : children}
    </button>
  );
}
