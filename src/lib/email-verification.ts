import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";
import User from "@/models/User";

export function buildEmailVerificationToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return { token, tokenHash, expiresAt };
}

export async function issueEmailVerification(user: {
  _id: string;
  username: string;
  email?: string;
  emailVerificationTokenHash?: string;
  emailVerificationExpiresAt?: Date;
}) {
  if (!user.email) {
    throw new Error("This account has no email address. Please update email first.");
  }

  const { token, tokenHash, expiresAt } = buildEmailVerificationToken();
  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        emailVerificationTokenHash: tokenHash,
        emailVerificationExpiresAt: expiresAt,
      },
    }
  );

  await sendVerificationEmail({
    to: user.email,
    username: user.username,
    token,
  });
}
