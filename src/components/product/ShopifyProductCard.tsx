import { Link } from "react-router-dom";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
}

const ShopifyProductCard = ({ product }: ShopifyProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { node } = product;
  
  const firstImage = node.images.edges[0]?.node;
  const firstVariant = node.variants.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstVariant) return;

    addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || [],
    });

    toast.success("Dodano u košaricu", {
      description: node.title,
      position: "top-center",
    });
  };

  return (
    <div className="product-card block group">
      <Link to={`/shop/${node.handle}`} className="block">
        <div className="product-card-image relative mb-4">
          {firstImage ? (
            <img
              src={firstImage.url}
              alt={firstImage.altText || node.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground font-body text-sm">Nema slike</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="space-y-2">
        <h3 className="font-display text-lg tracking-wide text-foreground group-hover:text-accent transition-colors">
          <Link to={`/shop/${node.handle}`}>{node.title}</Link>
        </h3>
        <p className="font-body text-xs text-muted-foreground line-clamp-2">
          {node.description}
        </p>
        <div className="flex items-center justify-between gap-3 pt-2">
          <span className="price-display font-medium">
            {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddToCart}
            disabled={!firstVariant?.availableForSale}
            className="gap-2"
          >
            <ShoppingCart size={14} />
            <span className="hidden sm:inline">Dodaj</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShopifyProductCard;
