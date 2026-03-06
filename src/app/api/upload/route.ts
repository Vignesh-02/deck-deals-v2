import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadDeckImage, MAX_IMAGE_SIZE, ALLOWED_MIMES } from "@/lib/imagekit";
import logger from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIMES.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, GIF, and WebP images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Image must be under 5 MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { url } = await uploadDeckImage(buffer, file.name);

    return NextResponse.json({ url });
  } catch (err) {
    logger.error({ err }, "Image upload failed");
    return NextResponse.json(
      { error: "Image upload failed. Please try again." },
      { status: 500 }
    );
  }
}
