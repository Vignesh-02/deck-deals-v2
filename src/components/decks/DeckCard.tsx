import Link from "next/link";
import { IDeck } from "@/types";
import { normalizeImageUrl } from "@/lib/image-url";
import Badge from "@/components/ui/Badge";

function getCoverImage(deck: IDeck): string {
  if (deck.images && deck.images.length > 0) {
    return normalizeImageUrl(deck.images[0]);
  }
  if (deck.image) return normalizeImageUrl(deck.image);
  return "";
}

function getImageCount(deck: IDeck): number {
  if (deck.images && deck.images.length > 0) return deck.images.length;
  if (deck.image) return 1;
  return 0;
}

export default function DeckCard({ deck }: { deck: IDeck }) {
  const inStock = parseInt(deck.stock) > 0;
  const coverImage = getCoverImage(deck);
  const imageCount = getImageCount(deck);

  return (
    <Link href={`/decks/${deck._id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl border border-[#2a2a2a] bg-surface transition-all duration-300 group-hover:border-brand-gold/30 group-hover:shadow-xl group-hover:shadow-brand-gold/5">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-surface-darker">
          {coverImage ? (
            <img
              src={coverImage}
              alt={deck.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <span className="text-cream-faint text-sm">No image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Stock badge */}
          <div className="absolute top-3 left-3">
            <Badge variant={inStock ? "green" : "red"}>
              {inStock ? `${deck.stock} left` : "Sold out"}
            </Badge>
          </div>

          {/* Image count badge */}
          {imageCount > 1 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-cream text-xs font-medium">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {imageCount}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-display text-lg tracking-[0.05em] uppercase text-cream truncate group-hover:text-brand-gold transition-colors">
            {deck.name}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-cream-muted">
              by {deck.author.username}
            </span>
            <span className="font-display text-lg text-brand-gold">
              &#8377;{deck.price}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
