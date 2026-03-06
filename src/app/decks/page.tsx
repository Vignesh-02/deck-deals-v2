import dbConnect from "@/lib/db";
import Deck from "@/models/Deck";
import DeckGrid from "@/components/decks/DeckGrid";
import Link from "next/link";

export const metadata = { title: "Shop — Deck Deals" };
export const dynamic = "force-dynamic";

export default async function DecksPage() {
  await dbConnect();
  const decks = await Deck.find({}).lean();
  const serialized = JSON.parse(JSON.stringify(decks));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero header */}
      <div className="mb-12 animate-fade-up">
        <span className="inline-flex items-center rounded-md border border-brand-gold/20 bg-brand-gold/5 px-3 py-1 text-xs font-medium tracking-[0.15em] uppercase text-brand-gold mb-4">
          Premium Collection
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-[0.08em] uppercase text-cream">
          Deck Deals
        </h1>
        <p className="mt-3 max-w-xl text-cream-muted">
          Discover rare and premium playing card decks from sellers worldwide.
          Where magicians, cardists, and collectors find their next treasure.
        </p>
        <div className="mt-6 flex items-center gap-4">
          <Link
            href="/decks/new"
            className="inline-flex items-center rounded-lg bg-brand-gold px-6 py-3 text-sm font-semibold tracking-[0.1em] uppercase text-surface-darker hover:bg-brand-gold-light shadow-lg shadow-brand-gold/20 hover:shadow-brand-gold/40 transition-all"
          >
            Sell a deck
          </Link>
          <span className="text-sm text-cream-faint">
            {serialized.length} {serialized.length === 1 ? "deck" : "decks"} listed
          </span>
        </div>
      </div>

      {/* Grid */}
      <DeckGrid decks={serialized} />
    </div>
  );
}
