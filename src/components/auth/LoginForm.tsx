"use client";

import { useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const verified = searchParams.get("verified");

  const verificationMessage = useMemo(() => {
    if (verified === "1") return "Email verified successfully. You can now log in.";
    if (verified === "invalid") return "Verification link is invalid or expired.";
    if (verified === "missing") return "Verification token is missing.";
    if (verified === "error") return "Could not verify email. Please request a new link.";
    return "";
  }, [verified]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      if (result.error.toLowerCase().includes("verify")) {
        setError("Please verify your email before logging in.");
      } else {
        setError("Invalid username or password.");
      }
      setLoading(false);
    } else {
      addToast(`Welcome back, ${username}!`, "success");
      router.push("/decks");
      router.refresh();
    }
  }

  async function handleResendVerification() {
    if (!username.trim()) {
      setError("Enter your username or email first, then resend verification.");
      return;
    }

    setResendLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: username }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not resend verification email.");
        return;
      }
      addToast(
        data.message ||
          "If an unverified account exists, a verification email has been sent.",
        "success"
      );
    } catch {
      setError("Could not resend verification email.");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-950/50 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      {verificationMessage && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
          {verificationMessage}
        </div>
      )}
      <Input
        label="Username or Email"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username or email"
        required
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        required
      />
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Signing in..." : "Log in"}
      </Button>
      <Button
        type="button"
        variant="secondary"
        fullWidth
        disabled={resendLoading}
        onClick={handleResendVerification}
      >
        {resendLoading ? "Sending..." : "Resend verification email"}
      </Button>
      <p className="text-center text-sm text-cream-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-brand-gold hover:text-brand-gold-light transition-colors">
          Sign up
        </Link>
      </p>
    </form>
  );
}
