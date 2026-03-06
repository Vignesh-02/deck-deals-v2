import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Deck from "@/models/Deck";
import { deckSchema } from "@/lib/validations";
import logger from "@/lib/logger";

function normalizeImages(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter((value) => value.length > 0);
}

export async function GET() {
  try {
    await dbConnect();
    const decks = await Deck.find({}).lean();
    return NextResponse.json(decks);
  } catch (err) {
    logger.error({ err }, "Failed to fetch decks");
    return NextResponse.json({ error: "Failed to fetch decks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const normalizedBody = {
      ...body,
      images: normalizeImages(body?.images),
    };
    const result = deckSchema.safeParse(normalizedBody);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    await dbConnect();

    const data = result.data;
    const deck = await Deck.create({
      name: data.name,
      mobile: data.mobile,
      email: data.email,
      address: data.address,
      price: String(data.price),
      images: data.images,
      image: data.images[0], // Keep legacy single-image field in sync.
      description: data.description || "",
      stock: String(data.stock),
      author: {
        id: (session.user as any).id,
        username: session.user.name!,
      },
    });

    // Guard against stale model schemas in dev hot-reload: ensure `images` is
    // persisted using the raw collection API (bypasses schema strict filtering).
    await Deck.collection.updateOne(
      { _id: deck._id },
      { $set: { images: data.images, image: data.images[0] } }
    );

    return NextResponse.json(
      { message: "Deck created", deckId: deck._id.toString() },
      { status: 201 }
    );
  } catch (err) {
    logger.error({ err }, "Deck create failed");
    return NextResponse.json({ error: "Failed to create deck" }, { status: 500 });
  }
}
