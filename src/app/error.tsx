"use client";

import Button from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
      <div className="text-center animate-fade-up">
        <p className="font-display text-7xl sm:text-8xl text-cream-faint/20 tracking-[0.1em]">
          500
        </p>
        <h1 className="mt-4 font-display text-2xl sm:text-3xl tracking-[0.1em] uppercase text-cream">
          Something went wrong
        </h1>
        <p className="mt-3 text-cream-muted max-w-sm mx-auto">
          {error.message || "An unexpected error occurred."}
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button onClick={reset} variant="secondary">
            Try again
          </Button>
          <a href="/decks">
            <Button>Back to shop</Button>
          </a>
        </div>
      </div>
    </section>
  );
}
