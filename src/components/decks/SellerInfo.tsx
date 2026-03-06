import { IDeck } from "@/types";

export default function SellerInfo({ deck }: { deck: IDeck }) {
  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-surface p-6 space-y-5">
      <h3 className="font-display text-sm tracking-[0.15em] uppercase text-brand-gold">
        Seller Information
      </h3>
      <div className="space-y-4">
        <InfoRow label="Contact" value={deck.mobile} />
        <InfoRow label="Email" value={deck.email} />
        <InfoRow label="Address" value={deck.address} />
      </div>
      <div className="border-t border-[#2a2a2a] pt-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs text-cream-faint tracking-wide">
            Ready to ship worldwide
          </span>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-cream-faint tracking-wide uppercase">{label}</span>
      <p className="mt-0.5 text-sm text-cream">{value}</p>
    </div>
  );
}
