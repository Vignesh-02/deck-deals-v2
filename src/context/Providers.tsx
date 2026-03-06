"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "./ToastContext";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>{children}</ToastProvider>
    </SessionProvider>
  );
}
