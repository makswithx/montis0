import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/product/ProductCard";
import ProductRotator from "@/components/product/ProductRotator";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { ChevronLeft, Minus, Plus, Heart, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProductPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <Layout>
        <div className="container-eleya py-20 text-center">
          <h1 className="font-display text-2xl mb-4">Proizvod nije pronađen</h1>
          <Link to="/kolekcija" className="nav-link">
            ← Nazad na kolekciju
          </Link>
        </div>
      </Layout>
    );
  }

  // Placeholder rotation images - different perfume angles using varied stock photos
  const rotationImages = [
    product.image,
    "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600&h=800&fit=crop",
  ];

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.brand === product.brand)
    .slice(0, 4);

  const handleAddToCart = () => {
    toast({
      title: "Dodato u korpu",
      description: `${product.name} (${quantity}x) je dodat u vašu korpu.`,
    });
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <section className="py-4 border-b border-border">
        <div className="container-eleya">
          <Link
            to="/kolekcija"
            className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={16} />
            Nazad na kolekciju
          </Link>
        </div>
      </section>

      {/* Product Section */}
      <section className="py-8 md:py-12">
        <div className="container-eleya">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* 360° Product Rotator */}
            <div>
              <ProductRotator 
                images={rotationImages} 
                productName={product.name} 
              />
            </div>

            {/* Product Info */}
            <div className="lg:sticky lg:top-28 lg:self-start space-y-6">
              {/* Brand & Name */}
              <div>
                <p className="brand-name mb-2">{product.brand}</p>
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-wide">
                  {product.name}
                </h1>
              </div>

              {/* Type & Volume */}
              <p className="font-body text-muted-foreground">
                {product.type} · {product.volume} · {product.gender}
              </p>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="font-display text-2xl md:text-3xl">
                  €{product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="font-body text-lg text-muted-foreground line-through">
                    €{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="font-body text-muted-foreground leading-relaxed">
                Ekskluzivan parfem iz kolekcije {product.brand}. 
                Bogat, sofisticiran miris koji ostavlja nezaboravan utisak.
                Idealan za posebne prilike i svakodnevnu eleganciju.
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="font-body text-sm tracking-wide">Količina:</span>
                <div className="flex items-center border border-border">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 hover:bg-bone-light transition-colors"
                    aria-label="Smanji količinu"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-body">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 hover:bg-bone-light transition-colors"
                    aria-label="Povećaj količinu"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-4">
                <Button variant="gold" size="lg" onClick={handleAddToCart} className="w-full">
                  Dodaj u korpu
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" size="lg" className="flex-1">
                    <Heart size={18} className="mr-2" />
                    Sačuvaj
                  </Button>
                  <Button variant="outline" size="icon" className="h-14 w-14">
                    <Share2 size={18} />
                  </Button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="pt-6 border-t border-border space-y-3">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Dostupnost</span>
                  <span className="text-green-700">Na stanju</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Isporuka</span>
                  <span>2-4 radna dana</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Besplatna dostava</span>
                  <span>Iznad €100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-40">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="font-body text-xs text-muted-foreground">{product.brand}</p>
            <p className="font-display text-lg">€{product.price.toFixed(2)}</p>
          </div>
          <Button variant="gold" onClick={handleAddToCart} className="flex-1">
            Dodaj u korpu
          </Button>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 md:py-24 border-t border-border mb-20 lg:mb-0">
          <div className="container-eleya">
            <h2 className="font-display text-2xl md:text-3xl tracking-wide mb-8 text-center">
              Takođe od {product.brand}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ProductPage;
