import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { issueEmailVerification } from "@/lib/email-verification";
import logger from "@/lib/logger";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById((session.user as any).id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Your email is already verified." },
        { status: 200 }
      );
    }

    await issueEmailVerification(user as any);

    return NextResponse.json({
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (err) {
    logger.error({ err }, "Failed to resend verification email");
    return NextResponse.json(
      { error: "Could not send verification email. Please try again." },
      { status: 500 }
    );
  }
}
