import { useEffect } from "react";
import { Truck, RotateCcw, ShieldCheck, Gift, Star, Heart, ArrowRight, Instagram, Facebook } from "lucide-react";
import MaxialHeader from "@/components/maxial/MaxialHeader";
import MaxialHero from "@/components/maxial/MaxialHero";
import catSkincare from "@/assets/maxial/cat-skincare.jpg";
import catMakeup from "@/assets/maxial/cat-makeup.jpg";
import catBody from "@/assets/maxial/cat-body.jpg";
import pSerum from "@/assets/maxial/p-serum.jpg";
import pLipstick from "@/assets/maxial/p-lipstick.jpg";
import pCream from "@/assets/maxial/p-cream.jpg";
import pPalette from "@/assets/maxial/p-palette.jpg";
import promoImg from "@/assets/maxial/promo.jpg";

const perks = [
  { icon: Truck, title: "Besplatna dostava", text: "Za narudžbe iznad 40 €" },
  { icon: RotateCcw, title: "Povrat do 30 dana", text: "Bez pitanja i komplikacija" },
  { icon: ShieldCheck, title: "100% originalno", text: "Ovlašteni distributer" },
  { icon: Gift, title: "Poklon uz narudžbu", text: "Mini proizvod iznad 60 €" },
];

const categories = [
  { title: "Njega lica", count: "124 proizvoda", image: catSkincare },
  { title: "Šminka", count: "208 proizvoda", image: catMakeup },
  { title: "Njega tijela", count: "86 proizvoda", image: catBody },
];

const products = [
  { brand: "Glow Reive", name: "Radiant Skin serum s hijaluronom", price: 29.9, compare: 39.9, rating: 4.9, reviews: 312, image: pSerum, badge: "−25%" },
  { brand: "Maison Rosé", name: "Satin ruž – Nude Petal", price: 18.5, compare: null, rating: 4.8, reviews: 187, image: pLipstick, badge: "Novo" },
  { brand: "Pure Cloud", name: "Hidratantna krema za lice 50 ml", price: 24.0, compare: 32.0, rating: 4.7, reviews: 421, image: pCream, badge: "−25%" },
  { brand: "Maison Rosé", name: "Paleta sjenila – Rose Nudes", price: 34.9, compare: null, rating: 4.9, reviews: 96, image: pPalette, badge: "Bestseller" },
];

const formatPrice = (n: number) => `${n.toFixed(2).replace(".", ",")} €`;

const Maxial = () => {
  useEffect(() => {
    const prev = document.title;
    document.title = "Maxial | Kozmetika za žene";
    window.scrollTo(0, 0);
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="theme-maxial min-h-screen bg-background text-foreground font-maxial-sans">
      <MaxialHeader />
      <MaxialHero />

      {/* Perks strip */}
      <section className="border-b border-border bg-card">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 grid grid-cols-2 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3 py-6 px-2 md:px-4">
              <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Icon size={20} strokeWidth={1.5} className="text-petal-deep" />
              </div>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-center mb-10 md:mb-14">
            <p className="text-xs tracking-[0.35em] uppercase text-petal-deep mb-3">Kupuj po kategoriji</p>
            <h2 className="font-maxial text-4xl md:text-5xl font-medium">Tvoj beauty ritual</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {categories.map((c) => (
              <div key={c.title} className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer">
                <img
                  src={c.image}
                  alt={c.title}
                  loading="lazy"
                  width={768}
                  height={1024}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 flex items-end justify-between text-primary-foreground">
                  <div>
                    <h3 className="font-maxial text-3xl md:text-4xl font-medium">{c.title}</h3>
                    <p className="text-sm opacity-80 mt-1">{c.count}</p>
                  </div>
                  <span className="w-11 h-11 rounded-full bg-background text-foreground flex items-center justify-center transition-transform group-hover:translate-x-1">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <p className="text-xs tracking-[0.35em] uppercase text-petal-deep mb-3">Omiljeno kod kupaca</p>
              <h2 className="font-maxial text-4xl md:text-5xl font-medium">Bestselleri</h2>
            </div>
            <button className="hidden sm:flex items-center gap-2 text-sm tracking-wide border-b border-foreground pb-0.5">
              Pogledaj sve <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
            {products.map((p) => (
              <div key={p.name} className="group">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    width={768}
                    height={1024}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span
                    className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-medium tracking-wide ${
                      p.badge.startsWith("−")
                        ? "bg-sale text-accent-foreground"
                        : "bg-background text-foreground"
                    }`}
                  >
                    {p.badge}
                  </span>
                  <button
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/90 flex items-center justify-center hover:text-petal transition-colors"
                    aria-label="Dodaj na listu želja"
                  >
                    <Heart size={16} strokeWidth={1.6} />
                  </button>
                  <button className="absolute inset-x-3 bottom-3 rounded-full bg-primary text-primary-foreground py-3 text-xs tracking-widest uppercase opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden md:block">
                    Dodaj u košaricu
                  </button>
                </div>
                <div className="pt-4">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">{p.brand}</p>
                  <h3 className="mt-1 font-maxial-sans text-sm md:text-[15px] leading-snug tracking-normal">{p.name}</h3>
                  <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className="fill-petal text-petal" />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">({p.reviews})</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className={`font-medium ${p.compare ? "text-sale" : ""}`}>{formatPrice(p.price)}</span>
                    {p.compare && (
                      <span className="text-sm text-muted-foreground line-through">{formatPrice(p.compare)}</span>
                    )}
                  </div>
                  <button className="md:hidden mt-3 w-full rounded-full border border-foreground/30 py-2.5 text-xs tracking-widest uppercase">
                    Dodaj u košaricu
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo split */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 rounded-3xl overflow-hidden bg-secondary">
            <img
              src={promoImg}
              alt="Žena nanosi serum na lice"
              loading="lazy"
              width={1024}
              height={1024}
              className="w-full h-full object-cover aspect-square md:aspect-auto"
            />
            <div className="p-8 md:p-14 lg:p-20 flex flex-col justify-center">
              <p className="text-xs tracking-[0.35em] uppercase text-petal-deep mb-4">Ograničena ponuda</p>
              <h2 className="font-maxial text-4xl md:text-6xl font-medium leading-[1.05]">
                Glow ritual
                <span className="block italic text-petal-deep">u 3 koraka</span>
              </h2>
              <p className="mt-6 text-foreground/75 max-w-md">
                Čišćenje, serum i hidratacija – set koji koži vraća svježinu i sjaj. Ovaj tjedan po
                posebnoj cijeni.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="rounded-xl border border-dashed border-petal-deep px-5 py-3">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Kod</p>
                  <p className="font-medium tracking-[0.2em] text-petal-deep">GLOW25</p>
                </div>
                <button className="rounded-full bg-primary text-primary-foreground px-8 py-4 text-sm tracking-widest uppercase hover:bg-petal-deep transition-colors">
                  Kupi set
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-24 bg-blush">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="font-maxial text-4xl md:text-5xl font-medium">Pridruži se Maxial klubu</h2>
          <p className="mt-4 text-foreground/75">
            Prijavi se i ostvari <span className="font-medium text-petal-deep">10% popusta</span> na prvu narudžbu.
          </p>
          <form className="mt-8 flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Tvoja email adresa"
              className="flex-1 rounded-full bg-background border border-border px-6 py-4 text-sm focus:outline-none focus:border-petal"
            />
            <button className="rounded-full bg-primary text-primary-foreground px-8 py-4 text-sm tracking-widest uppercase">
              Prijavi se
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <p className="font-maxial text-3xl tracking-[0.25em]">MAXIAL</p>
            <p className="mt-4 text-sm opacity-70 max-w-xs">
              Pažljivo odabrana kozmetika za žene koje vole njegovati sebe.
            </p>
            <div className="flex gap-3 mt-6">
              <span className="w-10 h-10 rounded-full border border-primary-foreground/30 flex items-center justify-center">
                <Instagram size={16} />
              </span>
              <span className="w-10 h-10 rounded-full border border-primary-foreground/30 flex items-center justify-center">
                <Facebook size={16} />
              </span>
            </div>
          </div>
          {[
            { title: "Kupovina", links: ["Njega lica", "Šminka", "Njega tijela", "Akcija"] },
            { title: "Pomoć", links: ["Dostava", "Povrat", "Načini plaćanja", "Kontakt"] },
            { title: "Maxial", links: ["O nama", "Maxial klub", "Blog", "Uvjeti korištenja"] },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-xs tracking-[0.3em] uppercase opacity-60 mb-4">{col.title}</p>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l} className="opacity-85 hover:opacity-100 cursor-pointer">{l}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-primary-foreground/15">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row gap-3 items-center justify-between text-xs opacity-60">
            <p>© 2026 Maxial Beauty. Sva prava pridržana.</p>
            <p className="tracking-widest">VISA · MASTERCARD · PAYPAL · POUZEĆE</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Maxial;
