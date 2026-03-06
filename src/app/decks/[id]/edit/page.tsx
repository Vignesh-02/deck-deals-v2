import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Deck from "@/models/Deck";
import DeckForm from "@/components/decks/DeckForm";

export const dynamic = "force-dynamic";

export default async function EditDeckPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;
  await dbConnect();
  const deck = await Deck.findById(id).lean();
  if (!deck) notFound();

  const serialized = JSON.parse(JSON.stringify(deck));
  if (serialized.author.id?.toString() !== (session.user as any).id) {
    redirect("/decks");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="animate-fade-up">
        <h1 className="font-display text-3xl tracking-[0.1em] uppercase text-cream mb-2">
          Edit {serialized.name}
        </h1>
        <p className="text-cream-muted mb-8">Update the deck details below.</p>
        <div className="rounded-2xl border border-[#2a2a2a] bg-surface p-6 sm:p-8">
          <DeckForm deck={serialized} mode="edit" />
        </div>
      </div>
    </div>
  );
}
