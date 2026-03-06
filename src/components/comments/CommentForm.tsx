"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Link from "next/link";

interface CommentFormProps {
  deckId: string;
  commentId?: string;
  initialText?: string;
  mode: "create" | "edit";
}

export default function CommentForm({
  deckId,
  commentId,
  initialText = "",
  mode,
}: CommentFormProps) {
  const [text, setText] = useState(initialText);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { addToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url =
      mode === "create"
        ? `/api/decks/${deckId}/comments`
        : `/api/decks/${deckId}/comments/${commentId}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      addToast(
        mode === "create" ? "Review posted!" : "Review updated!",
        "success"
      );
      router.push(`/decks/${deckId}`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-950/50 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      <Textarea
        label="Your review"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What do you think about this deck? Share your thoughts on quality, design, handling..."
        rows={5}
        required
        maxLength={2000}
      />
      <div className="flex items-center justify-between">
        <Link
          href={`/decks/${deckId}`}
          className="text-sm text-cream-muted hover:text-cream transition-colors"
        >
          &larr; Back to deck
        </Link>
        <Button type="submit" disabled={loading}>
          {loading
            ? mode === "create"
              ? "Posting..."
              : "Saving..."
            : mode === "create"
              ? "Post review"
              : "Save review"}
        </Button>
      </div>
    </form>
  );
}
