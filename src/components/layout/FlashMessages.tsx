"use client";

import { useToast } from "@/context/ToastContext";

export default function FlashMessages() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 w-full max-w-md px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-fade-up rounded-lg border px-5 py-3.5 shadow-lg backdrop-blur-sm cursor-pointer transition-opacity ${
            toast.type === "error"
              ? "border-red-500/30 bg-red-950/80 text-red-100"
              : "border-brand-gold/30 bg-brand-gold/10 text-cream"
          }`}
          onClick={() => removeToast(toast.id)}
        >
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
