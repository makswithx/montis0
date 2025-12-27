import { Link } from "react-router-dom";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  type: string;
  volume: string;
  gender: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/proizvod/${product.id}`} className="product-card block group">
      <div className="product-card-image relative mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.originalPrice && (
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 font-body text-xs tracking-wide">
            AKCIJA
          </span>
        )}
      </div>
      <div className="space-y-2">
        <p className="brand-name">{product.brand}</p>
        <h3 className="font-display text-lg tracking-wide text-foreground group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <p className="font-body text-xs text-muted-foreground">
          {product.type} · {product.volume}
        </p>
        <div className="flex items-center gap-3">
          <span className="price-display font-medium">€{product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="price-display text-muted-foreground line-through">
              €{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
