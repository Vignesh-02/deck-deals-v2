import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium tracking-wide uppercase text-cream-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full rounded-lg border border-[#2a2a2a] bg-surface-dark px-4 py-3 text-cream placeholder:text-cream-faint focus:border-brand-gold/60 focus:ring-1 focus:ring-brand-gold/30 outline-none transition-colors ${
            error ? "border-red-500/50" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
