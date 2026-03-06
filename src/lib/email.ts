import logger from "@/lib/logger";

function getAppBaseUrl(): string {
  const base =
    process.env.NEXTAUTH_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    "http://localhost:3000";
  return base.replace(/\/$/, "");
}

export async function sendVerificationEmail({
  to,
  username,
  token,
}: {
  to: string;
  username: string;
  token: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim() || "Deck Deals <onboarding@deckdeals.in>";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is required for email verification.");
  }

  const verifyUrl = `${getAppBaseUrl()}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  const subject = "Verify your Deck Deals account";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2>Verify Your Email</h2>
      <p>Hi ${username},</p>
      <p>Click the button below to verify your email and activate your Deck Deals account.</p>
      <p>
        <a href="${verifyUrl}" style="display:inline-block;padding:10px 16px;background:#d4af37;color:#111;text-decoration:none;border-radius:6px;font-weight:600;">
          Verify Email
        </a>
      </p>
      <p>If the button doesn't work, use this link:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>This link expires in 24 hours.</p>
    </div>
  `.trim();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    logger.error(
      {
        status: res.status,
        body: text,
        to,
        from,
      },
      "Failed to send verification email"
    );
    throw new Error(
      `Could not send verification email (Resend ${res.status}): ${text.slice(0, 400)}`
    );
  }
}
