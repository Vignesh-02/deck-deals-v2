export default function Footer() {
  return (
    <footer className="border-t border-[#2a2a2a]/60 bg-surface-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-brand-gold font-bold">&#9824;</span>
            <span className="font-display text-sm tracking-[0.15em] uppercase text-cream-muted">
              Deck Deals
            </span>
          </div>
          <p className="text-xs text-cream-faint tracking-wide">
            &copy; {new Date().getFullYear()} Deck Deals. Powered by magic &amp; caffeine.
          </p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-cream-faint">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
