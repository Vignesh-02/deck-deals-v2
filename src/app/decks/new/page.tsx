import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DeckForm from "@/components/decks/DeckForm";

export const metadata = { title: "Sell a Deck — Deck Deals" };

export default async function NewDeckPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if ((session.user as any).role !== "seller") redirect("/decks");

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="animate-fade-up">
        <h1 className="font-display text-3xl tracking-[0.1em] uppercase text-cream mb-2">
          Add a new deck
        </h1>
        <p className="text-cream-muted mb-8">
          Fill in the details to list your deck for sale.
        </p>
        <div className="rounded-2xl border border-[#2a2a2a] bg-surface p-6 sm:p-8">
          <DeckForm mode="create" currentUserEmail={session.user?.email || ""} />
        </div>
      </div>
    </div>
  );
}
