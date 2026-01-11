import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useShopifyProduct, useAllProducts } from "@/hooks/useShopifyProducts";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart, Heart, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ShopifyProductCard from "@/components/product/ShopifyProductCard";
import { formatPrice, getMetafieldValue, getProductSizes } from "@/lib/shopify";

const ShopifyProductPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const { data: product, isLoading, error } = useShopifyProduct(handle || "");
  const { data: allProducts } = useAllProducts(8);
  const addItem = useCartStore((state) => state.addItem);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container-montis py-20 text-center">
          <h1 className="font-display text-2xl mb-4">Proizvod nije pronađen</h1>
          <Link to="/kolekcija" className="nav-link">
            ← Povratak na kolekciju
          </Link>
        </div>
      </Layout>
    );
  }

  const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;
  const mainImage = product.images.edges[0]?.node;
  const price = selectedVariant?.price || product.priceRange.minVariantPrice;
  const compareAtPrice = selectedVariant?.compareAtPrice;
  const hasDiscount = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  // Get metafield values
  const gender = getMetafieldValue<string>(product.gender);
  const fragranceType = getMetafieldValue<string>(product.fragranceType);
  const notesFamily = getMetafieldValue<string>(product.notesFamily);
  const sizes = getProductSizes(product);

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || [],
    });

    toast.success("Dodano u košaricu", {
      description: `${product.title} (${quantity}x)`,
      position: "top-center",
    });
  };

  // Get related products (excluding current product, same vendor if possible)
  const relatedProducts = allProducts?.filter(
    (p) => p.node.id !== product.id
  ).slice(0, 4) || [];

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container-montis py-4">
          <nav className="font-body text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Početna
            </Link>
            <span className="mx-2">/</span>
            <Link to="/kolekcija" className="hover:text-foreground transition-colors">
              Kolekcija
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-8 md:py-16">
        <div className="container-montis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Image */}
            <div className="aspect-[3/4] bg-muted overflow-hidden relative">
              {mainImage ? (
                <img
                  src={mainImage.url}
                  alt={mainImage.altText || product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-muted-foreground font-body">Nema slike</span>
                </div>
              )}
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 font-body text-sm">
                  Akcija
                </span>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-8">
                {/* Brand */}
                <p className="font-body text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  {product.vendor}
                </p>
                
                <h1 className="font-display text-3xl md:text-4xl tracking-wide mb-4">
                  {product.title}
                </h1>

                {/* Product attributes */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {fragranceType && (
                    <span className="px-2 py-1 bg-muted font-body text-xs uppercase tracking-wider">
                      {fragranceType}
                    </span>
                  )}
                  {gender && (
                    <span className="px-2 py-1 bg-muted font-body text-xs uppercase tracking-wider">
                      {gender === 'men' ? 'Muški' : gender === 'women' ? 'Ženski' : 'Unisex'}
                    </span>
                  )}
                  {notesFamily && (
                    <span className="px-2 py-1 bg-muted font-body text-xs uppercase tracking-wider">
                      {notesFamily}
                    </span>
                  )}
                </div>
                
                {product.description && (
                  <p className="font-body text-muted-foreground mb-6">
                    {product.description}
                  </p>
                )}

                {/* Price */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="price-display text-2xl">
                    {formatPrice(price.amount, price.currencyCode)}
                  </span>
                  {hasDiscount && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
                    </span>
                  )}
                </div>

                {/* Variant Selection (Size) */}
                {product.options.length > 0 && product.variants.edges.length > 1 && (
                  <div className="mb-6">
                    <p className="font-body text-sm text-muted-foreground mb-3">
                      {product.options[0].name}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {product.variants.edges.map((variant, index) => (
                        <button
                          key={variant.node.id}
                          onClick={() => setSelectedVariantIndex(index)}
                          className={`px-4 py-2 font-body text-sm border transition-colors ${
                            selectedVariantIndex === index
                              ? "border-foreground bg-foreground text-background"
                              : "border-border hover:border-foreground"
                          } ${!variant.node.availableForSale ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={!variant.node.availableForSale}
                        >
                          {variant.node.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-8">
                  <p className="font-body text-sm text-muted-foreground mb-3">
                    Količina
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-muted transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-body">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-3 hover:bg-muted transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="flex gap-3 mb-8">
                  <Button
                    size="lg"
                    className="flex-1 gap-2"
                    onClick={handleAddToCart}
                    disabled={!selectedVariant?.availableForSale}
                  >
                    <ShoppingCart size={18} />
                    {selectedVariant?.availableForSale
                      ? "Dodaj u košaricu"
                      : "Nije dostupno"}
                  </Button>
                  <Button size="lg" variant="outline">
                    <Heart size={18} />
                  </Button>
                  <Button size="lg" variant="outline">
                    <Share2 size={18} />
                  </Button>
                </div>

                {/* Availability Info */}
                <div className="space-y-3 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 font-body text-sm">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        selectedVariant?.availableForSale
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span>
                      {selectedVariant?.availableForSale
                        ? "Na zalihama"
                        : "Nema na zalihama"}
                    </span>
                  </div>
                  <p className="font-body text-sm text-muted-foreground">
                    Besplatna dostava za narudžbe iznad €100
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="container-montis">
            <h2 className="font-display text-2xl md:text-3xl tracking-wide mb-8">
              Slični proizvodi
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {relatedProducts.map((product) => (
                <ShopifyProductCard key={product.node.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border lg:hidden z-40">
        <Button
          size="lg"
          className="w-full gap-2"
          onClick={handleAddToCart}
          disabled={!selectedVariant?.availableForSale}
        >
          <ShoppingCart size={18} />
          Dodaj u košaricu - {formatPrice(price.amount, price.currencyCode)}
        </Button>
      </div>
    </Layout>
  );
};

export default ShopifyProductPage;
