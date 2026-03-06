import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Deck from "@/models/Deck";
import "@/models/Comment";
import DeckDetail from "@/components/decks/DeckDetail";
import SellerInfo from "@/components/decks/SellerInfo";
import DeckActions from "@/components/decks/DeckActions";
import CommentList from "@/components/comments/CommentList";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await dbConnect();
  const deck = await Deck.findById(id).lean();
  return { title: deck ? `${(deck as any).name} — Deck Deals` : "Deck Deals" };
}

export default async function DeckShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await dbConnect();
  const deck = await Deck.findById(id).populate("comments").lean();
  if (!deck) notFound();

  const serialized = JSON.parse(JSON.stringify(deck));
  const session = await getServerSession(authOptions);
  const isOwner =
    session?.user && (session.user as any).id === serialized.author.id?.toString();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/decks"
          className="text-sm text-cream-faint hover:text-cream transition-colors"
        >
          &larr; Back to shop
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-10 animate-fade-up">
          <DeckDetail deck={serialized} />

          {/* Reviews */}
          <div className="border-t border-[#2a2a2a] pt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl tracking-[0.1em] uppercase text-cream">
                Reviews
                <span className="ml-2 text-cream-faint text-base">
                  ({serialized.comments?.length || 0})
                </span>
              </h2>
              {session?.user && (
                <Link
                  href={`/decks/${serialized._id}/comments/new`}
                  className="text-sm text-brand-gold hover:text-brand-gold-light transition-colors"
                >
                  + Add a review
                </Link>
              )}
            </div>
            <CommentList
              comments={serialized.comments || []}
              deckId={serialized._id}
              currentUserId={(session?.user as any)?.id}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <SellerInfo deck={serialized} />
          {isOwner && <DeckActions deckId={serialized._id} />}
        </div>
      </div>
    </div>
  );
}
