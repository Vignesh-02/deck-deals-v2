import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Deck from "@/models/Deck";
import "@/models/Comment";
import { deckSchema } from "@/lib/validations";
import logger from "@/lib/logger";

function normalizeImages(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter((value) => value.length > 0);
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const deck = await Deck.findById(id).populate("comments").lean();
    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }
    return NextResponse.json(deck);
  } catch (err) {
    logger.error({ err }, "Failed to fetch deck");
    return NextResponse.json({ error: "Failed to fetch deck" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const deck = await Deck.findById(id);
    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }
    if (deck.author.id.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    const data = result.data;
    const updatePayload = {
      name: data.name,
      mobile: data.mobile,
      email: data.email,
      address: data.address,
      price: String(data.price),
      images: data.images,
      image: data.images[0], // Keep legacy single-image field in sync.
      description: data.description || "",
      stock: String(data.stock),
    };

    await Deck.findByIdAndUpdate(id, updatePayload);

    // Guard against stale model schemas in dev hot-reload: ensure `images` is
    // persisted using the raw collection API (bypasses schema strict filtering).
    await Deck.collection.updateOne({ _id: deck._id }, { $set: updatePayload });

    return NextResponse.json({ message: "Deck updated" });
  } catch (err) {
    logger.error({ err }, "Deck update failed");
    return NextResponse.json({ error: "Failed to update deck" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const deck = await Deck.findById(id);
    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }
    if (deck.author.id.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Deck.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deck deleted" });
  } catch (err) {
    logger.error({ err }, "Deck delete failed");
    return NextResponse.json({ error: "Failed to delete deck" }, { status: 500 });
  }
}
