"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function DeckActions({ deckId }: { deckId: string }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this deck?")) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/decks/${deckId}`, { method: "DELETE" });
      if (res.ok) {
        addToast("Deck deleted", "success");
        router.push("/decks");
        router.refresh();
      } else {
        addToast("Failed to delete deck", "error");
        setDeleting(false);
      }
    } catch {
      addToast("Something went wrong", "error");
      setDeleting(false);
    }
  }

  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-surface p-6 space-y-3">
      <h3 className="font-display text-sm tracking-[0.15em] uppercase text-cream-muted">
        Manage Deck
      </h3>
      <Link href={`/decks/${deckId}/edit`}>
        <Button variant="secondary" fullWidth>
          Edit deck
        </Button>
      </Link>
      <Button
        variant="danger"
        fullWidth
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? "Deleting..." : "Delete deck"}
      </Button>
    </div>
  );
}
