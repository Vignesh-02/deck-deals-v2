import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Comment from "@/models/Comment";
import CommentForm from "@/components/comments/CommentForm";

export const dynamic = "force-dynamic";

export default async function EditCommentPage({
  params,
}: {
  params: Promise<{ id: string; commentId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id, commentId } = await params;
  await dbConnect();
  const comment = await Comment.findById(commentId).lean();
  if (!comment) notFound();

  const serialized = JSON.parse(JSON.stringify(comment));
  if (serialized.author.id?.toString() !== (session.user as any).id) {
    redirect(`/decks/${id}`);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="animate-fade-up">
        <h1 className="font-display text-3xl tracking-[0.1em] uppercase text-cream mb-2">
          Edit your review
        </h1>
        <p className="text-cream-muted mb-8">Update your review below.</p>
        <div className="rounded-2xl border border-[#2a2a2a] bg-surface p-6 sm:p-8">
          <CommentForm
            deckId={id}
            commentId={commentId}
            initialText={serialized.text}
            mode="edit"
          />
        </div>
      </div>
    </div>
  );
}
