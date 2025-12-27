import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBg})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-obsidian/40 to-obsidian/70" />
        </div>

        <div className="relative z-10 container-eleya text-center text-bone-light">
          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl tracking-[0.1em] mb-6 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            ELEYA
          </h1>
          <p
            className="font-body text-lg md:text-xl tracking-wide mb-10 max-w-xl mx-auto opacity-0 animate-slide-up text-bone-light/90"
            style={{ animationDelay: "0.4s" }}
          >
            Ekskluzivna kolekcija parfema iz cijeloga svijeta
          </p>
          <div
            className="opacity-0 animate-slide-up"
            style={{ animationDelay: "0.6s" }}
          >
            <Button variant="outlineLight" size="lg" asChild>
              <Link to="/kolekcija">
                Istražite kolekciju
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-12 bg-bone-light/50" />
        </div>
      </section>

      {/* Brand Statement */}
      <section className="py-20 md:py-32">
        <div className="container-eleya text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-wide mb-6 max-w-3xl mx-auto">
            Pronađite svoj savršeni miris
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Preko 3.500 originalnih parfema od vodećih svjetskih brendova. 
            Svakom parfemu pristupamo sa strašću i pažnjom prema detaljima.
          </p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="pb-20 md:pb-32">
        <div className="container-eleya">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="brand-name mb-2">Izdvajamo</p>
              <h2 className="font-display text-2xl md:text-3xl tracking-wide">
                Popularne note
              </h2>
            </div>
            <Link
              to="/kolekcija"
              className="nav-link flex items-center gap-2"
            >
              Pogledaj sve
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="opacity-0 animate-slide-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-20 md:pb-32">
        <div className="container-eleya">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                title: "Za njega",
                image: "https://images.unsplash.com/photo-1547887538-047f814bfb64?w=600&h=800&fit=crop",
                link: "/kolekcija?gender=Muški",
              },
              {
                title: "Za nju",
                image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=800&fit=crop",
                link: "/kolekcija?gender=Ženski",
              },
              {
                title: "Unisex",
                image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600&h=800&fit=crop",
                link: "/kolekcija?gender=Unisex",
              },
            ].map((category, index) => (
              <Link
                key={category.title}
                to={category.link}
                className="relative aspect-[3/4] group overflow-hidden opacity-0 animate-slide-up"
                style={{ animationDelay: `${0.15 * index}s` }}
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h3 className="font-display text-2xl md:text-3xl text-bone-light tracking-wide">
                    {category.title}
                  </h3>
                  <span className="font-body text-sm text-bone-light/80 tracking-widest uppercase mt-2 flex items-center gap-2 group-hover:gap-3 transition-all">
                    Istražite
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-20 md:py-32 bg-foreground text-bone-light">
        <div className="container-eleya text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-4">
            Ostanite u toku
          </h2>
          <p className="font-body text-bone-light/70 mb-8">
            Saznajte prvi za nove kolekcije i ekskluzivne ponude.
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Vaša email adresa"
              className="flex-1 bg-transparent border border-bone-light/30 px-4 py-3 font-body text-sm placeholder:text-bone-light/50 focus:outline-none focus:border-bone-light transition-colors"
            />
            <Button variant="gold" type="submit">
              Prijavite se
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
