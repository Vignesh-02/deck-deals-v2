"use client";

import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

type AccountProfile = {
  username: string;
  email: string;
  role: "seller" | "customer";
  emailVerified: boolean;
};

export default function AccountSettings() {
  const { addToast } = useToast();
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      setLoadingProfile(true);
      try {
        const res = await fetch("/api/account", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) {
          addToast(data.error || "Could not load account.", "error");
          return;
        }
        setProfile(data);
        setEmail(data.email || "");
      } catch {
        addToast("Could not load account.", "error");
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, [addToast]);

  async function handleChangeEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailLoading(true);

    try {
      const res = await fetch("/api/account/email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Could not update email.", "error");
        return;
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              email,
              emailVerified: false,
            }
          : prev
      );
      addToast(data.message || "Email updated.", "success");
    } catch {
      addToast("Could not update email.", "error");
    } finally {
      setEmailLoading(false);
    }
  }

  async function handleResendVerification() {
    setResending(true);
    try {
      const res = await fetch("/api/account/resend-verification", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Could not resend verification email.", "error");
        return;
      }
      addToast(data.message || "Verification email sent.", "success");
    } catch {
      addToast("Could not resend verification email.", "error");
    } finally {
      setResending(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordLoading(true);

    try {
      const res = await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "Could not update password.", "error");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      addToast(data.message || "Password updated.", "success");
    } catch {
      addToast("Could not update password.", "error");
    } finally {
      setPasswordLoading(false);
    }
  }

  if (loadingProfile) {
    return (
      <div className="rounded-2xl border border-[#2a2a2a] bg-surface p-6 text-cream-muted">
        Loading account settings...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-950/40 p-6 text-red-300">
        Could not load account settings.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#2a2a2a] bg-surface p-6">
        <h2 className="font-display text-xl tracking-[0.08em] uppercase text-cream">
          Account
        </h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Username" value={profile.username} readOnly />
          <Input label="Role" value={profile.role === "seller" ? "Seller" : "Customer"} readOnly />
        </div>
      </section>

      <section className="rounded-2xl border border-[#2a2a2a] bg-surface p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl tracking-[0.08em] uppercase text-cream">
            Email & Verification
          </h2>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${
              profile.emailVerified
                ? "bg-emerald-900/50 text-emerald-300 border border-emerald-500/30"
                : "bg-amber-900/40 text-amber-300 border border-amber-500/30"
            }`}
          >
            {profile.emailVerified ? "Verified" : "Not verified"}
          </span>
        </div>

        <form onSubmit={handleChangeEmail} className="space-y-3">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={emailLoading}>
              {emailLoading ? "Saving..." : "Update email"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={resending}
              onClick={handleResendVerification}
            >
              {resending ? "Sending..." : "Resend verification"}
            </Button>
          </div>
          <p className="text-xs text-cream-faint">
            Changing your email requires re-verification.
          </p>
        </form>
      </section>

      <section className="rounded-2xl border border-[#2a2a2a] bg-surface p-6 space-y-4">
        <h2 className="font-display text-xl tracking-[0.08em] uppercase text-cream">
          Security
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-3">
          <Input
            label="Current password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            required
          />
          <Input
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            required
          />
          <Button type="submit" disabled={passwordLoading}>
            {passwordLoading ? "Updating..." : "Update password"}
          </Button>
        </form>
      </section>
    </div>
  );
}
