"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

type UserRole = "seller" | "customer";
const USERNAME_PATTERN = /^[A-Za-z0-9]+$/;
const HAS_UPPERCASE = /[A-Z]/;
const HAS_SPECIAL = /[^A-Za-z0-9]/;

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { addToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 5) {
      setError("Username must be at least 5 characters long.");
      setLoading(false);
      return;
    }
    if (!USERNAME_PATTERN.test(trimmedUsername)) {
      setError("Username can only contain letters and numbers.");
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }
    if (!HAS_UPPERCASE.test(password)) {
      setError("Password must include at least one uppercase letter.");
      setLoading(false);
      return;
    }
    if (!HAS_SPECIAL.test(password)) {
      setError("Password must include at least one special character.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmedUsername, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      setSuccess("Account created. Check your email and verify your account to log in.");
      addToast("Verification email sent. Please verify your account.", "success");
      setLoading(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-950/50 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
          {success}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium tracking-wide uppercase text-cream-muted">
          I am joining as
        </label>
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-[#2a2a2a] bg-surface-darker p-2">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`rounded-lg px-3 py-3 text-sm font-semibold tracking-wide uppercase transition-all ${
              role === "customer"
                ? "bg-brand-gold text-surface-darker shadow-lg shadow-brand-gold/30"
                : "bg-transparent text-cream-muted hover:text-cream hover:bg-[#1f1f1f]"
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole("seller")}
            className={`rounded-lg px-3 py-3 text-sm font-semibold tracking-wide uppercase transition-all ${
              role === "seller"
                ? "bg-brand-gold text-surface-darker shadow-lg shadow-brand-gold/30"
                : "bg-transparent text-cream-muted hover:text-cream hover:bg-[#1f1f1f]"
            }`}
          >
            Seller
          </button>
        </div>
        <p className="text-xs text-cream-faint">
          {role === "seller"
            ? "You can list decks and manage inventory."
            : "You can browse, buy, and review decks."}
        </p>
      </div>
      <Input
        label="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Choose a username"
        minLength={5}
        pattern="[A-Za-z0-9]+"
        required
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />
      <div>
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Choose a password"
          minLength={8}
          required
        />
        <p className="mt-1 text-xs text-cream-faint">
          Minimum 8 characters, with 1 uppercase and 1 special character
        </p>
      </div>
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </Button>
      <p className="text-center text-sm text-cream-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-gold hover:text-brand-gold-light transition-colors">
          Log in
        </Link>
      </p>
      {success && (
        <button
          type="button"
          onClick={() => {
            router.push("/login");
            router.refresh();
          }}
          className="w-full text-sm text-brand-gold hover:text-brand-gold-light transition-colors"
        >
          Go to login
        </button>
      )}
    </form>
  );
}
