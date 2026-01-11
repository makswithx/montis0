import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ShopifyProductCard from "@/components/product/ShopifyProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import VideoHero from "@/components/home/VideoHero";
import { useBestsellers, useNewArrivals, useSignatureCollection, useSeasonalCollection } from "@/hooks/useShopifyProducts";

const Index = () => {
  const { data: bestsellers, isLoading: loadingBestsellers } = useBestsellers(4);
  const { data: newArrivals, isLoading: loadingNew } = useNewArrivals(4);
  const { data: signatureProducts } = useSignatureCollection(4);
  const { data: summerProducts } = useSeasonalCollection('summer', 4);

  // Dynamic collections based on available data
  const collections = [
    {
      id: "bestsellers",
      name: "Najprodavanije",
      slug: "bestsellers",
      description: "Najpopularniji parfemi koje naši kupci obožavaju",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=600&fit=crop",
      link: "/kolekcija?sort=bestselling",
    },
    {
      id: "new",
      name: "Novo u ponudi",
      slug: "new",
      description: "Najnoviji dodaci našoj ekskluzivnoj kolekciji",
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&h=600&fit=crop",
      link: "/kolekcija?sort=newest",
    },
    {
      id: "signature",
      name: "Signature kolekcija",
      slug: "signature",
      description: "Ikonični mirisi koji definiraju luksuz",
      image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&h=600&fit=crop",
      link: "/kolekcija?collection=signature",
    },
    {
      id: "summer",
      name: "Ljetna kolekcija",
      slug: "summer",
      description: "Svježi i lagani mirisi za tople dane",
      image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&h=600&fit=crop",
      link: "/kolekcija?season=summer",
    },
  ];

  const hasProducts = bestsellers && bestsellers.length > 0;

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
                to={collection.link}
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
              to="/kolekcija?sort=bestselling"
              className="nav-link flex items-center gap-2"
            >
              Pogledaj sve
              <ArrowRight size={16} />
            </Link>
          </div>

          {loadingBestsellers ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : hasProducts ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {bestsellers.map((product) => (
                <ShopifyProductCard key={product.node.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="font-body text-muted-foreground mb-4">
                Trenutno nema proizvoda u ponudi.
              </p>
              <p className="font-body text-sm text-muted-foreground">
                Dodajte proizvode u Shopify Admin da bi se prikazali ovdje.
              </p>
            </div>
          )}
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
              to="/kolekcija?sort=newest"
              className="nav-link flex items-center gap-2"
            >
              Pogledaj sve
              <ArrowRight size={16} />
            </Link>
          </div>

          {loadingNew ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : newArrivals && newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {newArrivals.map((product) => (
                <ShopifyProductCard key={product.node.id} product={product} />
              ))}
            </div>
          ) : hasProducts ? null : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="font-body text-muted-foreground">
                Uskoro nove kolekcije.
              </p>
            </div>
          )}
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
                image: "https://images.unsplash.com/photo-1547887538-047f814bfb64?w=600&h=800&fit=crop",
                link: "/kolekcija?gender=men",
              },
              {
                title: "Za nju",
                image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=800&fit=crop",
                link: "/kolekcija?gender=women",
              },
              {
                title: "Unisex",
                image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600&h=800&fit=crop",
                link: "/kolekcija?gender=unisex",
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
