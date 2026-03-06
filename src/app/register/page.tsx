import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = { title: "Sign up — Deck Deals" };

export default function RegisterPage() {
  return (
    <section className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-up">
        <div className="rounded-2xl border border-[#2a2a2a] bg-surface p-8 shadow-2xl shadow-black/40">
          <div className="mb-8">
            <h1 className="font-display text-3xl tracking-[0.1em] uppercase text-cream">
              Create account
            </h1>
            <p className="mt-2 text-cream-muted">
              Join Deck Deals and get the best deals on premium decks.
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </section>
  );
}
