"use client";

import { Dispatch, SetStateAction, useState, useRef, useCallback, useEffect } from "react";

interface ImageUploadProps {
  images: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
  maxImages?: number;
  onUploadingChange?: (isUploading: boolean) => void;
}

export default function ImageUpload({
  images,
  onChange,
  maxImages = 8,
  onUploadingChange,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isUploading = Object.keys(uploading).length > 0;

  useEffect(() => {
    onUploadingChange?.(isUploading);
  }, [isUploading, onUploadingChange]);

  const uploadFile = useCallback(
    async (file: File) => {
      const id = `${file.name}-${Date.now()}`;
      setUploading((prev) => ({ ...prev, [id]: true }));
      setError("");

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Upload failed");
          return null;
        }

        return data.url as string;
      } catch {
        setError("Upload failed. Please try again.");
        return null;
      } finally {
        setUploading((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
    },
    []
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const remaining = maxImages - images.length;
      if (remaining <= 0) {
        setError(`Maximum ${maxImages} images allowed.`);
        return;
      }
      const toUpload = fileArray.slice(0, remaining);

      const urls = await Promise.all(toUpload.map(uploadFile));
      const successful = urls.filter(
        (u): u is string => typeof u === "string" && u.trim().length > 0
      );
      if (successful.length > 0) {
        onChange((prev) => [...prev, ...successful]);
      }
    },
    [maxImages, onChange, uploadFile]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function removeImage(index: number) {
    onChange((prev) => prev.filter((_, i) => i !== index));
  }

  // Reorder via drag
  function handleThumbDragStart(index: number) {
    setDragIndex(index);
  }

  function handleThumbDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDragOverIndex(index);
  }

  function handleThumbDrop(index: number) {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    onChange((prev) => {
      if (dragIndex >= prev.length) return prev;
      const reordered = [...prev];
      const [moved] = reordered.splice(dragIndex, 1);
      reordered.splice(index, 0, moved);
      return reordered;
    });
    setDragIndex(null);
    setDragOverIndex(null);
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium tracking-wide uppercase text-cream-muted">
        Images
      </label>

      {/* Drop zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        className={`w-full rounded-xl border-2 border-dashed transition-all duration-200 p-8 text-center cursor-pointer ${
          dragOver
            ? "border-brand-gold bg-brand-gold/5"
            : "border-[#2a2a2a] hover:border-brand-gold/40 bg-surface-dark"
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <svg
            className="w-8 h-8 text-cream-faint"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 16V4m0 0L8 8m4-4l4 4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17"
            />
          </svg>
          {isUploading ? (
            <div className="flex items-center gap-2 text-brand-gold">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="opacity-20"
                />
                <path
                  d="M12 2a10 10 0 019.95 9"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-sm">Uploading...</span>
            </div>
          ) : (
            <>
              <p className="text-sm text-cream-muted">
                <span className="text-brand-gold font-medium">Click to browse</span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-cream-faint">
                JPEG, PNG, GIF, WebP up to 5 MB &middot; Max {maxImages} images
              </p>
            </>
          )}
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* Image previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              draggable
              onDragStart={() => handleThumbDragStart(index)}
              onDragOver={(e) => handleThumbDragOver(e, index)}
              onDrop={() => handleThumbDrop(index)}
              onDragEnd={() => {
                setDragIndex(null);
                setDragOverIndex(null);
              }}
              className={`group relative aspect-square rounded-lg overflow-hidden border cursor-grab active:cursor-grabbing transition-all duration-200 ${
                dragOverIndex === index
                  ? "border-brand-gold scale-105"
                  : dragIndex === index
                    ? "opacity-40 border-[#2a2a2a]"
                    : "border-[#2a2a2a] hover:border-cream-faint"
              }`}
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="h-full w-full object-cover"
                draggable={false}
              />

              {/* Cover badge */}
              {index === 0 && (
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-brand-gold text-surface-darker">
                  Cover
                </span>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Drag handle hint */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5 opacity-0 group-hover:opacity-60 transition-opacity">
                <span className="w-1 h-1 rounded-full bg-cream" />
                <span className="w-1 h-1 rounded-full bg-cream" />
                <span className="w-1 h-1 rounded-full bg-cream" />
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 1 && (
        <p className="text-xs text-cream-faint">
          Drag to reorder. First image is the cover.
        </p>
      )}
    </div>
  );
}
