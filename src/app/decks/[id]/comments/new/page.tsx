import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CommentForm from "@/components/comments/CommentForm";

export const metadata = { title: "Add Review — Deck Deals" };

export default async function NewCommentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="animate-fade-up">
        <h1 className="font-display text-3xl tracking-[0.1em] uppercase text-cream mb-2">
          Add your review
        </h1>
        <p className="text-cream-muted mb-8">
          Share your thoughts about this deck.
        </p>
        <div className="rounded-2xl border border-[#2a2a2a] bg-surface p-6 sm:p-8">
          <CommentForm deckId={id} mode="create" />
        </div>
      </div>
    </div>
  );
}
