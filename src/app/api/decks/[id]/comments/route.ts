import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Deck from "@/models/Deck";
import Comment from "@/models/Comment";
import { commentSchema } from "@/lib/validations";
import logger from "@/lib/logger";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const result = commentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    await dbConnect();

    const deck = await Deck.findById(id);
    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    const comment = await Comment.create({
      text: result.data.text,
      author: {
        id: (session.user as any).id,
        username: session.user.name!,
      },
    });

    deck.comments.push(comment._id);
    await deck.save();

    return NextResponse.json(
      { message: "Comment created", commentId: comment._id.toString() },
      { status: 201 }
    );
  } catch (err) {
    logger.error({ err }, "Comment create failed");
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
