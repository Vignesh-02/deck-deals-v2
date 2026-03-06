import { NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { issueEmailVerification } from "@/lib/email-verification";
import logger from "@/lib/logger";

const resendSchema = z.object({
  identifier: z.string().min(1, "Username or email is required."),
});

// Public endpoint used from the login form.
// Always returns a generic success message to avoid account enumeration.
export async function POST(req: Request) {
  const genericMessage =
    "If an unverified account exists for that username/email, a verification email has been sent.";

  try {
    const body = await req.json();
    const result = resendSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    await dbConnect();

    const identifier = result.data.identifier.trim();
    const normalized = identifier.toLowerCase();

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: normalized }],
    });

    if (!user || user.emailVerified || !user.email) {
      return NextResponse.json({ message: genericMessage });
    }

    await issueEmailVerification(user as any);
    return NextResponse.json({ message: genericMessage });
  } catch (err) {
    logger.error({ err }, "Public resend verification failed");
    return NextResponse.json({ message: genericMessage });
  }
}
