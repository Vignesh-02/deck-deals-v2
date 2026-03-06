import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Comment from "@/models/Comment";
import { commentSchema } from "@/lib/validations";
import logger from "@/lib/logger";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { commentId } = await params;
    await dbConnect();

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    if (comment.author.id.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const result = commentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    await Comment.findByIdAndUpdate(commentId, { text: result.data.text });
    return NextResponse.json({ message: "Comment updated" });
  } catch (err) {
    logger.error({ err }, "Comment update failed");
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { commentId } = await params;
    await dbConnect();

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    if (comment.author.id.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Comment.findByIdAndDelete(commentId);
    return NextResponse.json({ message: "Comment deleted" });
  } catch (err) {
    logger.error({ err }, "Comment delete failed");
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
