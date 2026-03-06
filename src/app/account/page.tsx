import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AccountSettings from "@/components/account/AccountSettings";

export const metadata = { title: "Account — Deck Deals" };

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8 animate-fade-up">
        <h1 className="font-display text-3xl sm:text-4xl tracking-[0.08em] uppercase text-cream">
          Account Settings
        </h1>
        <p className="mt-2 text-cream-muted">
          Manage your profile, verification, and password.
        </p>
      </div>

      <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <AccountSettings />
      </div>
    </div>
  );
}
