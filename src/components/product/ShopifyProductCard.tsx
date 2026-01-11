import { Link } from "react-router-dom";
import { ShopifyProduct, getProductSizes, formatPrice } from "@/lib/shopify";
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
  const compareAtPrice = node.compareAtPriceRange?.minVariantPrice;
  const hasDiscount = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  
  // Get sizes from variants
  const sizes = getProductSizes(node);

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
      <Link to={`/proizvod/${node.handle}`} className="block">
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
          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-1 text-xs font-body">
              Akcija
            </span>
          )}
        </div>
      </Link>
      
      <div className="space-y-2">
        {/* Brand / Vendor */}
        <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">
          {node.vendor}
        </p>
        
        {/* Product Title */}
        <h3 className="font-display text-lg tracking-wide text-foreground group-hover:text-accent transition-colors line-clamp-1">
          <Link to={`/proizvod/${node.handle}`}>{node.title}</Link>
        </h3>
        
        {/* Sizes */}
        {sizes.length > 0 && (
          <p className="font-body text-xs text-muted-foreground">
            {sizes.join(' / ')}
          </p>
        )}
        
        {/* Price and Cart */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="price-display font-medium">
              {formatPrice(price.amount, price.currencyCode)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
              </span>
            )}
          </div>
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
