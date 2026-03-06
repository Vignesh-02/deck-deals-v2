"use client";

const cards = [
  {
    suit: "♠",
    color: "text-brand-gold",
    bg: "bg-brand-gold/5",
    border: "border-brand-gold/10",
    animation: "animate-float-card-1",
    position: "top-[15%] left-[8%]",
    size: "h-32 w-24",
    rotate: "-rotate-12",
    delay: "",
  },
  {
    suit: "♥",
    color: "text-red-500/50",
    bg: "bg-red-500/5",
    border: "border-red-500/10",
    animation: "animate-float-card-2",
    position: "top-[25%] right-[10%]",
    size: "h-28 w-20",
    rotate: "rotate-6",
    delay: "animation-delay: 2s",
  },
  {
    suit: "♦",
    color: "text-brand-gold/40",
    bg: "bg-brand-gold/3",
    border: "border-brand-gold/8",
    animation: "animate-float-card-3",
    position: "bottom-[20%] left-[15%]",
    size: "h-24 w-18",
    rotate: "rotate-12",
    delay: "animation-delay: 4s",
  },
  {
    suit: "♣",
    color: "text-cream-faint/30",
    bg: "bg-cream/3",
    border: "border-cream/5",
    animation: "animate-float-card-1",
    position: "bottom-[30%] right-[12%]",
    size: "h-28 w-20",
    rotate: "-rotate-6",
    delay: "animation-delay: 6s",
  },
];

export default function FloatingCards() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Radial gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[120px] animate-glow-orbit" />

      {cards.map((card, i) => (
        <div
          key={i}
          className={`absolute ${card.position} ${card.animation} ${card.rotate}`}
          style={card.delay ? { animationDelay: card.delay.split(": ")[1] } : {}}
        >
          <div
            className={`${card.size} rounded-xl border ${card.border} ${card.bg} backdrop-blur-sm flex items-center justify-center shadow-2xl`}
          >
            <span className={`text-4xl ${card.color}`}>{card.suit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
