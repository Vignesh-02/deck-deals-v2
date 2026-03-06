import { IDeck } from "@/types";
import DeckCard from "./DeckCard";

export default function DeckGrid({ decks }: { decks: IDeck[] }) {
  if (decks.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-display text-2xl tracking-[0.1em] uppercase text-cream-muted">
          No decks yet
        </p>
        <p className="mt-2 text-cream-faint">Be the first to add a deck.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {decks.map((deck) => (
        <DeckCard key={deck._id} deck={deck} />
      ))}
    </div>
  );
}
