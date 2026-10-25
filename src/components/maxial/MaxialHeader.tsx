import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";

const announcements = [
  "−25% na sve serume uz kod GLOW25",
  "Besplatna dostava za narudžbe iznad 40 €",
  "Poklon mini krema uz svaku narudžbu iznad 60 €",
  "Proljetna kolekcija je stigla",
];

const navLinks = [
  { label: "Novo", hasMenu: false },
  { label: "Njega lica", hasMenu: true },
  { label: "Šminka", hasMenu: true },
  { label: "Njega tijela", hasMenu: true },
  ];

const MaxialHeader = () => {
  const [open, setOpen] = useState(false);
  const items = [...announcements, ...announcements];

  return (
    <div className="sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="bg-petal-deep text-cream overflow-hidden">
        <div className="flex w-max animate-maxial-marquee py-2.5">
          {items.map((text, i) => (
            <span
              key={i}
              className="flex items-center gap-8 px-8 text-xs md:text-[13px] tracking-[0.15em] uppercase whitespace-nowrap"
            >
              {text}
              <span className="text-blush" aria-hidden>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main header */}
      <header className="bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 md:h-20">
            {/* Left: nav */}
            <div className="flex items-center">
              <button
                className="lg:hidden p-2 -ml-2"
                onClick={() => setOpen(!open)}
                aria-label="Izbornik"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
              <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
                {navLinks.map((l) => (
                  <button
                    key={l.label}
                    className="flex items-center gap-1 whitespace-nowrap text-sm tracking-wide text-foreground/80 hover:text-foreground transition-colors"
                  >
                    {l.label}
                    {l.hasMenu && <ChevronDown size={14} className="opacity-60" />}
                  </button>
                ))}
                <button className="text-sm tracking-wide font-medium text-sale">Akcija</button>
              </nav>
            </div>

            {/* Center: logo */}
            <Link to="/maxial" className="justify-self-center text-center leading-none">
              <span className="block font-maxial text-3xl md:text-4xl font-medium tracking-[0.25em] pl-[0.25em]">
                MAXIAL
              </span>
              <span className="block text-[9px] md:text-[10px] tracking-[0.5em] uppercase text-muted-foreground mt-1 pl-[0.5em]">
                Beauty
              </span>
            </Link>

            {/* Right: icons */}
            <div className="flex items-center justify-end gap-1 md:gap-2">
              <button className="p-2 hover:text-petal transition-colors" aria-label="Pretraga">
                <Search size={20} strokeWidth={1.6} />
              </button>
              <button className="hidden md:block p-2 hover:text-petal transition-colors" aria-label="Račun">
                <User size={20} strokeWidth={1.6} />
              </button>
              <button className="hidden md:block p-2 hover:text-petal transition-colors" aria-label="Lista želja">
                <Heart size={20} strokeWidth={1.6} />
              </button>
              <button className="relative p-2 hover:text-petal transition-colors" aria-label="Košarica">
                <ShoppingBag size={20} strokeWidth={1.6} />
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-petal text-accent-foreground text-[10px] font-medium flex items-center justify-center">
                  2
                </span>
              </button>
            </div>
          </div>
        </div>

        {open && (
          <nav className="lg:hidden border-t border-border bg-background px-4 py-4 flex flex-col animate-fade-in">
            {navLinks.map((l) => (
              <button key={l.label} className="py-3 text-left border-b border-border/60 text-sm">
                {l.label}
              </button>
            ))}
            <button className="py-3 text-left text-sm font-medium text-sale">Akcija</button>
          </nav>
        )}
      </header>
    </div>
  );
};

export default MaxialHeader;
