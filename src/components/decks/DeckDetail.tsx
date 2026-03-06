import { IDeck } from "@/types";
import { normalizeImageUrl } from "@/lib/image-url";
import Badge from "@/components/ui/Badge";
import ImageGallery from "@/components/ui/ImageGallery";

function getDeckImages(deck: IDeck): string[] {
  if (deck.images && deck.images.length > 0) {
    return deck.images.map((url) => normalizeImageUrl(url)).filter(Boolean);
  }
  if (deck.image) return [normalizeImageUrl(deck.image)].filter(Boolean);
  return [];
}

export default function DeckDetail({ deck }: { deck: IDeck }) {
  const inStock = parseInt(deck.stock) > 0;
  const images = getDeckImages(deck);

  return (
    <div className="space-y-6">
      {/* Image Gallery */}
      <ImageGallery images={images} alt={deck.name} />

      {/* Info */}
      <div className="space-y-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl tracking-[0.08em] uppercase text-cream">
            {deck.name}
          </h1>
          <p className="mt-1 text-cream-muted">
            by <span className="text-cream">{deck.author.username}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-display text-3xl text-brand-gold">
            &#8377;{deck.price}
          </span>
          <Badge variant={inStock ? "green" : "red"}>
            {inStock ? `${deck.stock} in stock` : "Sold out"}
          </Badge>
        </div>

        {deck.description && (
          <p className="text-cream-muted leading-relaxed">{deck.description}</p>
        )}
      </div>
    </div>
  );
}
