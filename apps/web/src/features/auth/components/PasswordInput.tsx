import { forwardRef, useState } from "react";
import type { InputHTMLAttributes } from "react";

interface PasswordInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> {
  error?: string;
  className?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ error, className = "", ...props }, ref) {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="flex flex-col gap-1 w-full text-left">
        {error && (
          <span className="text-xs font-semibold text-feedback-error">
            {error}
          </span>
        )}
        <div className="relative w-full">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={`w-full rounded p-2 pr-10 font-medium transition-colors disabled:opacity-50 bg-surface-paper border ${
              error ? "border-feedback-error" : "border-surface-border"
            } ${className}`}
            {...props}
          />
          <button
            type="button"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-content-secondary cursor-pointer bg-transparent border-none focus:outline-none"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" x2="22" y1="2" y2="22" />
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  },
);
