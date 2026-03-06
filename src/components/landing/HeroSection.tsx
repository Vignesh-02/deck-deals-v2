import Link from "next/link";
import FloatingCards from "./FloatingCards";

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-darker via-black to-surface-darker" />

      {/* Floating cards */}
      <FloatingCards />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl mx-auto animate-fade-up">
        <div className="mb-6 inline-flex items-center rounded-full border border-brand-gold/20 bg-brand-gold/5 px-4 py-1.5">
          <span className="text-brand-gold mr-2">&#9824;</span>
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-brand-gold">
            The Land of Magic
          </span>
        </div>

        <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl tracking-[0.1em] uppercase text-cream leading-[0.9]">
          Welcome to
          <br />
          <span className="text-brand-gold">Deck Deals</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-cream-muted max-w-xl mx-auto leading-relaxed">
          Discover and sell premium playing card decks.
          The marketplace where magicians, cardists, and collectors
          find their next masterpiece.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/decks"
            className="inline-flex items-center rounded-lg bg-brand-gold px-8 py-4 text-base font-semibold tracking-[0.15em] uppercase text-surface-darker hover:bg-brand-gold-light shadow-xl shadow-brand-gold/25 hover:shadow-brand-gold/40 transition-all"
          >
            Explore decks
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center rounded-lg border border-[#2a2a2a] bg-surface/50 px-8 py-4 text-base font-medium tracking-[0.1em] uppercase text-cream hover:border-brand-gold/40 hover:text-brand-gold transition-all"
          >
            Get started
          </Link>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-darker to-transparent" />
    </section>
  );
}
