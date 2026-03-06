import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import logger from "@/lib/logger";

function getBaseUrl(req: Request): string {
  const configured =
    process.env.NEXTAUTH_URL?.trim() ||
    process.env.APP_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const baseUrl = getBaseUrl(req);

    if (!token) {
      return NextResponse.redirect(`${baseUrl}/login?verified=missing`);
    }

    await dbConnect();

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.redirect(`${baseUrl}/login?verified=invalid`);
    }

    user.emailVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationExpiresAt = undefined;
    await user.save();

    return NextResponse.redirect(`${baseUrl}/login?verified=1`);
  } catch (err) {
    logger.error({ err }, "Email verification failed");
    const baseUrl = getBaseUrl(req);
    return NextResponse.redirect(`${baseUrl}/login?verified=error`);
  }
}
