import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
      <div className="text-center animate-fade-up">
        <p className="font-display text-7xl sm:text-8xl text-cream-faint/20 tracking-[0.1em]">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl sm:text-3xl tracking-[0.1em] uppercase text-cream">
          Page not found
        </h1>
        <p className="mt-3 text-cream-muted max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8">
          <Link href="/decks">
            <Button>Back to shop</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
