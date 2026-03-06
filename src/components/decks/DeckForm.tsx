"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import ImageUpload from "@/components/ui/ImageUpload";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { IDeck } from "@/types";

interface DeckFormProps {
  deck?: IDeck;
  mode: "create" | "edit";
}

function getDeckImages(deck?: IDeck): string[] {
  if (!deck) return [];
  if (deck.images && deck.images.length > 0) return deck.images;
  // Backwards-compat: legacy single image field
  if (deck.image) return [deck.image];
  return [];
}

export default function DeckForm({ deck, mode }: DeckFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: deck?.name || "",
    mobile: deck?.mobile || "",
    email: deck?.email || "",
    address: deck?.address || "",
    price: deck?.price || "",
    stock: deck?.stock || "",
    description: deck?.description || "",
  });

  const [images, setImages] = useState<string[]>(getDeckImages(deck));

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isUploadingImages) {
      setError("Please wait until all images finish uploading.");
      return;
    }

    const cleanedImages = images
      .map((url) => (typeof url === "string" ? url.trim() : ""))
      .filter((url) => url.length > 0);

    if (cleanedImages.length === 0) {
      setError("At least one image is required.");
      return;
    }
    setLoading(true);
    setError("");

    const url = mode === "create" ? "/api/decks" : `/api/decks/${deck?._id}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, images: cleanedImages }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      addToast(
        mode === "create" ? "Deck created successfully!" : "Deck updated!",
        "success"
      );

      if (mode === "create") {
        router.push(`/decks/${data.deckId}`);
      } else {
        router.push(`/decks/${deck?._id}`);
      }
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

      <Input
        label="Deck name"
        name="name"
        value={form.name}
        onChange={onChange}
        placeholder="e.g. Bicycle Rider Back"
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Contact number"
          name="mobile"
          value={form.mobile}
          onChange={onChange}
          placeholder="Phone number"
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          placeholder="seller@email.com"
          required
        />
      </div>

      <Input
        label="Address"
        name="address"
        value={form.address}
        onChange={onChange}
        placeholder="Shipping address"
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Price (₹)"
          name="price"
          type="number"
          min="0"
          value={form.price}
          onChange={onChange}
          placeholder="0"
          required
        />
        <Input
          label="Stock quantity"
          name="stock"
          type="number"
          min="0"
          value={form.stock}
          onChange={onChange}
          placeholder="0"
          required
        />
      </div>

      <ImageUpload
        images={images}
        onChange={setImages}
        onUploadingChange={setIsUploadingImages}
      />

      <Textarea
        label="Description"
        name="description"
        value={form.description}
        onChange={onChange}
        placeholder="Tell buyers about this deck..."
        rows={4}
      />

      <div className="flex items-center justify-between pt-2">
        <Link
          href={mode === "edit" ? `/decks/${deck?._id}` : "/decks"}
          className="text-sm text-cream-muted hover:text-cream transition-colors"
        >
          &larr; Cancel
        </Link>
        <Button type="submit" disabled={loading || isUploadingImages}>
          {loading
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : isUploadingImages
              ? "Uploading images..."
              : mode === "create"
              ? "Add deck"
              : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
