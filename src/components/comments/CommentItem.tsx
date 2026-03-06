"use client";

import { IComment } from "@/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface CommentItemProps {
  comment: IComment;
  deckId: string;
  isOwner: boolean;
}

export default function CommentItem({
  comment,
  deckId,
  isOwner,
}: CommentItemProps) {
  const router = useRouter();
  const { addToast } = useToast();

  async function handleDelete() {
    if (!confirm("Delete this review?")) return;

    try {
      const res = await fetch(
        `/api/decks/${deckId}/comments/${comment._id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        addToast("Review deleted", "success");
        router.refresh();
      } else {
        addToast("Failed to delete review", "error");
      }
    } catch {
      addToast("Something went wrong", "error");
    }
  }

  const timeAgo = comment.createdAt
    ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
    : "";

  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-surface-dark p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-gold/15 text-brand-gold text-xs font-bold uppercase">
            {comment.author.username?.[0]}
          </span>
          <div>
            <span className="text-sm font-medium text-cream">
              {comment.author.username}
            </span>
            {timeAgo && (
              <span className="ml-2 text-xs text-cream-faint">{timeAgo}</span>
            )}
          </div>
        </div>

        {isOwner && (
          <div className="flex items-center gap-2">
            <Link
              href={`/decks/${deckId}/comments/${comment._id}/edit`}
              className="text-xs text-cream-faint hover:text-brand-gold transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="text-xs text-cream-faint hover:text-red-400 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <p className="mt-3 text-sm text-cream-muted leading-relaxed">
        {comment.text}
      </p>
    </div>
  );
}
