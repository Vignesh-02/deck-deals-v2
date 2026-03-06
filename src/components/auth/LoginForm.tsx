"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { addToast } = useToast();

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
      setError("Invalid username or password.");
      setLoading(false);
    } else {
      addToast(`Welcome back, ${username}!`, "success");
      router.push("/decks");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-950/50 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      <Input
        label="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
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
      <p className="text-center text-sm text-cream-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-brand-gold hover:text-brand-gold-light transition-colors">
          Sign up
        </Link>
      </p>
    </form>
  );
}
