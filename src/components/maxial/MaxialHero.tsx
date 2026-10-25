import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/maxial/hero.jpg";

const MaxialHero = () => {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 8 + Math.random() * 34,
        delay: Math.random() * 12,
        duration: 12 + Math.random() * 14,
      })),
    []
  );

  const sparkles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: 5 + Math.random() * 90,
        top: 5 + Math.random() * 90,
        size: 8 + Math.random() * 10,
        delay: Math.random() * 6,
        duration: 3 + Math.random() * 3,
      })),
    []
  );

  return (
    <section className="relative h-[82vh] min-h-[560px] overflow-hidden">
      {/* Background with slow zoom */}
      <img
        src={heroImg}
        alt="Luksuzna kozmetika, serumi i kreme među božurima"
        width={1920}
        height={1088}
        className="absolute inset-0 w-full h-full object-cover animate-maxial-kenburns"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(var(--cream) / 0.85) 0%, hsl(var(--cream) / 0.45) 45%, transparent 75%)",
        }}
      />

      {/* Rising serum bubbles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {bubbles.map((b) => (
          <span
            key={b.id}
            className="absolute bottom-[-60px] rounded-full animate-maxial-bubble"
            style={{
              left: `${b.left}%`,
              width: b.size,
              height: b.size,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
              background:
                "radial-gradient(circle at 30% 30%, hsl(0 0% 100% / 0.95), hsl(var(--blush) / 0.5) 45%, hsl(var(--petal) / 0.15) 70%, transparent 72%)",
              boxShadow: "inset 0 0 6px hsl(0 0% 100% / 0.6)",
            }}
          />
        ))}
        {sparkles.map((s) => (
          <svg
            key={s.id}
            viewBox="0 0 24 24"
            className="absolute text-petal animate-maxial-twinkle"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          >
            <path fill="currentColor" d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
          </svg>
        ))}
      </div>

      {/* Spinning discount badge */}
      <div className="absolute top-8 right-6 md:top-14 md:right-16 z-10 w-28 h-28 md:w-36 md:h-36">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-maxial-spin text-petal-deep">
          <defs>
            <path id="maxial-circle" d="M50,50 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" />
          </defs>
          <text fontSize="9" letterSpacing="2.6" fill="currentColor" className="uppercase">
            <textPath href="#maxial-circle">Proljetna akcija • Glow sale • </textPath>
          </text>
        </svg>
        <div className="absolute inset-[24%] rounded-full bg-petal-deep text-cream flex flex-col items-center justify-center shadow-lg">
          <span className="font-maxial text-xl md:text-2xl font-semibold leading-none">−25%</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <div className="max-w-2xl">
          <p
            className="animate-maxial-rise text-xs md:text-sm tracking-[0.4em] uppercase text-petal-deep mb-5"
            style={{ animationDelay: "0.2s" }}
          >
            Nova kolekcija · Proljeće 2026
          </p>
          <h1
            className="animate-maxial-rise font-maxial text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] text-foreground"
            style={{ animationDelay: "0.4s" }}
          >
            Koža koja
            <span className="block italic text-petal-deep">sjaji iznutra</span>
          </h1>
          <p
            className="animate-maxial-rise mt-6 text-base md:text-lg text-foreground/75 max-w-md mx-auto"
            style={{ animationDelay: "0.6s" }}
          >
            Serumi, kreme i šminka koje vaša koža voli. Nježne formule, vidljivi rezultati.
          </p>
          <div
            className="animate-maxial-rise mt-9 flex flex-col sm:flex-row gap-3 justify-center"
            style={{ animationDelay: "0.8s" }}
          >
            <button className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-4 text-sm tracking-widest uppercase hover:bg-petal-deep transition-colors">
              Kupi sada
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button className="inline-flex items-center justify-center rounded-full border border-foreground/30 bg-background/60 backdrop-blur px-8 py-4 text-sm tracking-widest uppercase hover:border-foreground transition-colors">
              Otkrij njegu
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MaxialHero;
