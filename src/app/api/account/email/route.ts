import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { issueEmailVerification } from "@/lib/email-verification";
import logger from "@/lib/logger";

const updateEmailSchema = z.object({
  email: z.string().email("Please enter a valid email."),
});

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = updateEmailSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById((session.user as any).id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const normalizedEmail = result.data.email.trim().toLowerCase();

    if (user.email === normalizedEmail) {
      return NextResponse.json(
        { message: "Email is already set to this address." },
        { status: 200 }
      );
    }

    const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
    if (existing) {
      return NextResponse.json(
        { error: "Another account already uses this email." },
        { status: 400 }
      );
    }

    user.email = normalizedEmail;
    user.emailVerified = false;
    await issueEmailVerification(user as any);

    return NextResponse.json({
      message:
        "Email updated. We sent a new verification link to your new email address.",
    });
  } catch (err) {
    logger.error({ err }, "Failed to update account email");
    return NextResponse.json(
      { error: "Failed to update email. Please try again." },
      { status: 500 }
    );
  }
}
