import { ReactNode } from "react";

type BadgeVariant = "gold" | "green" | "red" | "muted";

const variants: Record<BadgeVariant, string> = {
  gold: "border-brand-gold/30 bg-brand-gold/10 text-brand-gold",
  green: "border-green-500/30 bg-green-950/50 text-green-400",
  red: "border-red-500/30 bg-red-950/50 text-red-400",
  muted: "border-[#2a2a2a] bg-surface text-cream-muted",
};

export default function Badge({
  variant = "muted",
  children,
}: {
  variant?: BadgeVariant;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium tracking-wide uppercase ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
