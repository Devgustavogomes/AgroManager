import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  error?: string;
  className?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ error, className = "", options, placeholder, ...props }, ref) {
    return (
      <div className="flex flex-col gap-1 w-full text-left">
        {error && (
          <span className="text-xs font-semibold text-feedback-error">
            {error}
          </span>
        )}
        <select
          ref={ref}
          className={`w-full rounded p-2 font-medium transition-colors disabled:opacity-50 bg-surface-paper border appearance-none cursor-pointer ${
            error ? "border-feedback-error" : "border-surface-border"
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  },
);
