import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium tracking-wide uppercase text-cream-muted">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full rounded-lg border border-[#2a2a2a] bg-surface-dark px-4 py-3 text-cream placeholder:text-cream-faint focus:border-brand-gold/60 focus:ring-1 focus:ring-brand-gold/30 outline-none transition-colors resize-none ${
            error ? "border-red-500/50" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
