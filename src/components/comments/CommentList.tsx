import { IComment } from "@/types";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: IComment[];
  deckId: string;
  currentUserId?: string;
}

export default function CommentList({
  comments,
  deckId,
  currentUserId,
}: CommentListProps) {
  if (!comments || comments.length === 0) {
    return (
      <p className="text-cream-faint text-sm py-6">
        No reviews yet. Be the first to share your thoughts.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          deckId={deckId}
          isOwner={currentUserId === comment.author.id?.toString()}
        />
      ))}
    </div>
  );
}
