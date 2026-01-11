import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { products, collections } from "@/data/products";
import { ArrowRight } from "lucide-react";
import VideoHero from "@/components/home/VideoHero";

const Index = () => {
  const featuredProducts = products.filter(p => p.collection === "bestsellers").slice(0, 4);
  const newProducts = products.filter(p => p.collection === "new").slice(0, 4);

  return (
    <Layout>
      {/* Video Hero Section */}
      <VideoHero />

      {/* Collections Grid */}
      <section className="py-20 md:py-28">
        <div className="container-montis">
          <div className="text-center mb-12">
            <p className="brand-name mb-3">Izdvojene</p>
            <h2 className="font-display text-3xl md:text-4xl tracking-wide">
              Kolekcije
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                to={`/kolekcija?collection=${collection.slug}`}
                className="relative aspect-[4/5] group overflow-hidden"
              >
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-obsidian/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className="font-display text-lg md:text-xl text-bone-light tracking-wide">
                    {collection.name}
                  </h3>
                  <p className="font-body text-xs text-bone-light/70 mt-1 hidden md:block">
                    {collection.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="pb-20 md:pb-28">
        <div className="container-montis">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="brand-name mb-2">Izdvajamo</p>
              <h2 className="font-display text-2xl md:text-3xl tracking-wide">
                Najprodavanije
              </h2>
            </div>
            <Link
              to="/kolekcija?collection=bestsellers"
              className="nav-link flex items-center gap-2"
            >
              Pogledaj sve
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="pb-20 md:pb-28">
        <div className="container-montis">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="brand-name mb-2">Svježe</p>
              <h2 className="font-display text-2xl md:text-3xl tracking-wide">
                Novo u ponudi
              </h2>
            </div>
            <Link
              to="/kolekcija?collection=new"
              className="nav-link flex items-center gap-2"
            >
              Pogledaj sve
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-20 md:pb-28">
        <div className="container-montis">
          <div className="text-center mb-12">
            <p className="brand-name mb-3">Pretražite po</p>
            <h2 className="font-display text-3xl md:text-4xl tracking-wide">
              Kategoriji
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                title: "Za njega",
                count: products.filter(p => p.gender === "Muški").length,
                image: "https://images.unsplash.com/photo-1547887538-047f814bfb64?w=600&h=800&fit=crop",
                link: "/kolekcija?gender=Muški",
              },
              {
                title: "Za nju",
                count: products.filter(p => p.gender === "Ženski").length,
                image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=800&fit=crop",
                link: "/kolekcija?gender=Ženski",
              },
              {
                title: "Unisex",
                count: products.filter(p => p.gender === "Unisex").length,
                image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600&h=800&fit=crop",
                link: "/kolekcija?gender=Unisex",
              },
            ].map((category) => (
              <Link
                key={category.title}
                to={category.link}
                className="relative aspect-[3/4] group overflow-hidden"
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
                  <p className="font-body text-sm text-bone-light/70 mt-1">
                    {category.count} proizvoda
                  </p>
                  <span className="font-body text-sm text-bone-light/80 tracking-widest uppercase mt-3 flex items-center gap-2 group-hover:gap-3 transition-all">
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
      <section className="py-20 md:py-28 bg-foreground text-bone-light">
        <div className="container-montis text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl tracking-wide mb-4">
            Budite informirani
          </h2>
          <p className="font-body text-bone-light/70 mb-8">
            Saznajte prvi za nove kolekcije provjerenih parfema.
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
