import ImageKit from "@imagekit/nodejs";
const { toFile } = ImageKit;

function cleanEnv(value: string | undefined): string {
  if (!value) return "";
  return value.trim().replace(/\s+/g, "").replace(/(^["']|["']$)/g, "");
}

function getImageKit() {
  const privateKey = cleanEnv(process.env.IMAGEKIT_PRIVATE_KEY);
  const publicKey = cleanEnv(process.env.IMAGEKIT_PUBLIC_KEY);
  const urlEndpoint = cleanEnv(process.env.IMAGEKIT_URL);
  if (!privateKey || !publicKey || !urlEndpoint) {
    throw new Error(
      "ImageKit env vars IMAGEKIT_PRIVATE_KEY, IMAGEKIT_PUBLIC_KEY, IMAGEKIT_URL are required"
    );
  }
  const endpoint = urlEndpoint.endsWith("/")
    ? urlEndpoint.slice(0, -1)
    : urlEndpoint;
  return new ImageKit({ privateKey, publicKey, urlEndpoint: endpoint });
}

const UPLOAD_FOLDER = "deck-deals";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

export async function uploadDeckImage(
  fileBuffer: Buffer,
  fileName: string
): Promise<{ url: string }> {
  const imagekit = getImageKit();
  const file = await toFile(fileBuffer, fileName);
  const uniqueName = `${Date.now()}-${(fileName || "image").replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const response = await imagekit.files.upload({
    file,
    fileName: uniqueName,
    folder: UPLOAD_FOLDER,
  });
  return { url: response.url! };
}

export { MAX_IMAGE_SIZE, ALLOWED_MIMES };
