"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const userRole = (session?.user as any)?.role as "seller" | "customer" | undefined;

  return (
    <nav className="sticky top-0 z-50 border-b border-[#2a2a2a]/60 bg-surface-darker/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/decks" className="flex items-center gap-3 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gold text-surface-darker font-bold text-lg shadow-md shadow-brand-gold/20 group-hover:shadow-brand-gold/40 transition-shadow">
              &#9824;
            </span>
            <span className="font-display text-xl tracking-[0.15em] uppercase text-cream group-hover:text-brand-gold transition-colors">
              Deck Deals
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-6">
            <Link
              href="/decks"
              className="text-sm font-medium tracking-[0.1em] uppercase text-cream-muted hover:text-brand-gold transition-colors"
            >
              Shop
            </Link>

            {!session ? (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium tracking-[0.1em] uppercase text-cream-muted hover:text-cream transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center rounded-lg bg-brand-gold px-5 py-2 text-sm font-semibold tracking-[0.1em] uppercase text-surface-darker hover:bg-brand-gold-light shadow-md shadow-brand-gold/20 hover:shadow-brand-gold/40 transition-all"
                >
                  Join
                </Link>
              </>
            ) : (
              <>
                {userRole === "seller" && (
                  <Link
                    href="/decks/new"
                    className="text-sm font-medium tracking-[0.1em] uppercase text-cream-muted hover:text-brand-gold transition-colors"
                  >
                    Sell
                  </Link>
                )}
                <Link
                  href="/account"
                  className="text-sm font-medium tracking-[0.1em] uppercase text-cream-muted hover:text-brand-gold transition-colors"
                >
                  Account
                </Link>
                <span className="flex items-center gap-2.5 rounded-lg border border-[#2a2a2a] bg-surface px-3 py-1.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-gold/20 text-brand-gold text-xs font-bold uppercase">
                    {session.user?.name?.[0]}
                  </span>
                  <span className="text-sm text-cream font-medium">
                    {session.user?.name}
                  </span>
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/decks" })}
                  className="text-sm font-medium tracking-[0.1em] uppercase text-cream-faint hover:text-red-400 transition-colors"
                >
                  Sign out
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden text-cream-muted hover:text-cream p-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-[#2a2a2a] py-4 space-y-3">
            <Link
              href="/decks"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium tracking-[0.1em] uppercase text-cream-muted hover:text-brand-gold transition-colors py-2"
            >
              Shop
            </Link>
            {!session ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium tracking-[0.1em] uppercase text-cream-muted hover:text-cream transition-colors py-2"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center rounded-lg bg-brand-gold px-5 py-2.5 text-sm font-semibold tracking-[0.1em] uppercase text-surface-darker"
                >
                  Join
                </Link>
              </>
            ) : (
              <>
                {userRole === "seller" && (
                  <Link
                    href="/decks/new"
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm font-medium tracking-[0.1em] uppercase text-cream-muted hover:text-brand-gold transition-colors py-2"
                  >
                    Sell a deck
                  </Link>
                )}
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium tracking-[0.1em] uppercase text-cream-muted hover:text-brand-gold transition-colors py-2"
                >
                  Account
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    signOut({ callbackUrl: "/decks" });
                  }}
                  className="block text-sm font-medium tracking-[0.1em] uppercase text-cream-faint hover:text-red-400 transition-colors py-2"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
