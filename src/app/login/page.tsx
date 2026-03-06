import LoginForm from "@/components/auth/LoginForm";

export const metadata = { title: "Log in — Deck Deals" };

export default function LoginPage() {
  return (
    <section className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-up">
        <div className="rounded-2xl border border-[#2a2a2a] bg-surface p-8 shadow-2xl shadow-black/40">
          <div className="mb-8">
            <h1 className="font-display text-3xl tracking-[0.1em] uppercase text-cream">
              Log in
            </h1>
            <p className="mt-2 text-cream-muted">Welcome back to Deck Deals.</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
