import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

export function buildEmailVerificationToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return { token, tokenHash, expiresAt };
}

export async function issueEmailVerification(user: {
  username: string;
  email: string;
  emailVerificationTokenHash?: string;
  emailVerificationExpiresAt?: Date;
  save: () => Promise<unknown>;
}) {
  const { token, tokenHash, expiresAt } = buildEmailVerificationToken();
  user.emailVerificationTokenHash = tokenHash;
  user.emailVerificationExpiresAt = expiresAt;
  await user.save();

  await sendVerificationEmail({
    to: user.email,
    username: user.username,
    token,
  });
}
