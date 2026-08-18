import type { InputHTMLAttributes } from "react";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  error?: string;
  className?: string;
}

export function Input({
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full text-left">
      {error && (
        <span className="text-xs font-semibold text-feedback-error">
          {error}
        </span>
      )}
      <input
        className={`w-full rounded p-2 font-medium transition-colors disabled:opacity-50 bg-surface-paper border ${
          error ? "border-feedback-error" : "border-surface-border"
        } ${className}`}
        {...props}
      />
    </div>
  );
}
