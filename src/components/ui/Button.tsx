import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-gold text-surface-darker font-semibold hover:bg-brand-gold-light shadow-lg shadow-brand-gold/20 hover:shadow-brand-gold/40",
  secondary:
    "border border-[#2a2a2a] bg-surface text-cream hover:border-brand-gold/40 hover:text-brand-gold",
  danger:
    "border border-red-500/30 bg-red-950/50 text-red-300 hover:bg-red-900/50 hover:border-red-500/50",
  ghost:
    "text-cream-muted hover:text-cream",
};

export default function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium tracking-wide uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
