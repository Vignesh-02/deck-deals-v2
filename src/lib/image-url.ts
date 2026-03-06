export function normalizeImageUrl(url: string | undefined | null): string {
  const raw = (url ?? "").trim();
  if (!raw) return "";

  // Keep absolute/protocol URLs unchanged.
  if (/^(https?:)?\/\//i.test(raw) || raw.startsWith("data:") || raw.startsWith("blob:")) {
    return raw;
  }

  // Ensure local paths are root-relative so nested routes do not break them.
  if (raw.startsWith("/")) return raw;
  return `/${raw.replace(/^\.\//, "")}`;
}
