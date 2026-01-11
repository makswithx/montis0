import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ShopifyProductCard from "@/components/product/ShopifyProductCard";
import { SlidersHorizontal, X, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useShopifyProducts, useVendors } from "@/hooks/useShopifyProducts";
import { ShopifyProduct, getProductSizes, ProductFilters } from "@/lib/shopify";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption = "bestselling" | "newest" | "price-asc" | "price-desc" | "title";

const Collection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Get initial filter values from URL
  const initialGender = searchParams.get("gender") || "";
  const initialVendor = searchParams.get("vendor") || "";
  const initialSort = (searchParams.get("sort") as SortOption) || "bestselling";
  const initialSeason = searchParams.get("season") || "";
  const initialCollection = searchParams.get("collection") || "";

  // Filter state
  const [selectedVendors, setSelectedVendors] = useState<string[]>(initialVendor ? [initialVendor] : []);
  const [selectedGenders, setSelectedGenders] = useState<string[]>(initialGender ? [initialGender] : []);
  const [selectedFragranceTypes, setSelectedFragranceTypes] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);

  // Build server-side filters
  const serverFilters = useMemo((): ProductFilters => {
    const filters: ProductFilters = {};
    
    // Gender filter via tags
    if (selectedGenders.length > 0) {
      filters.genders = selectedGenders;
    } else if (initialGender) {
      filters.genders = [initialGender];
    }
    
    // Vendor filter
    if (selectedVendors.length === 1) {
      filters.vendor = selectedVendors[0];
    } else if (initialVendor) {
      filters.vendor = initialVendor;
    }
    
    // Fragrance type via tags
    if (selectedFragranceTypes.length > 0) {
      filters.fragranceTypes = selectedFragranceTypes;
    }
    
    // Signature collection via tag
    if (initialCollection === 'signature') {
      filters.isSignature = true;
    }
    
    // Season via tag
    if (initialSeason) {
      filters.season = initialSeason;
    }
    
    // Sorting
    switch (sortBy) {
      case 'bestselling':
        filters.sortKey = 'BEST_SELLING';
        break;
      case 'newest':
        filters.sortKey = 'CREATED_AT';
        filters.reverse = true;
        break;
      case 'price-asc':
        filters.sortKey = 'PRICE';
        break;
      case 'price-desc':
        filters.sortKey = 'PRICE';
        filters.reverse = true;
        break;
      case 'title':
        filters.sortKey = 'TITLE';
        break;
    }
    
    return filters;
  }, [selectedGenders, selectedVendors, selectedFragranceTypes, initialGender, initialVendor, initialCollection, initialSeason, sortBy]);

  // Fetch products with server-side filters (scales to 3-5k products)
  const { data: products, isLoading } = useShopifyProducts(100, serverFilters);
  const { data: vendors } = useVendors();

  // Extract unique sizes and max price from products (these need client-side extraction)
  const filterOptions = useMemo(() => {
    if (!products) return { sizes: [], fragranceTypes: [], maxPrice: 1000 };

    const sizes = new Set<string>();
    let maxPrice = 0;

    products.forEach((p) => {
      // Sizes from variants
      getProductSizes(p.node).forEach(size => sizes.add(size));
      
      // Max price
      const price = parseFloat(p.node.priceRange.maxVariantPrice.amount);
      if (price > maxPrice) maxPrice = price;
    });

    return {
      sizes: Array.from(sizes).sort((a, b) => {
        const numA = parseInt(a);
        const numB = parseInt(b);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.localeCompare(b);
      }),
      // Static fragrance types - lowercase to match tag format (type_edp, type_edt, etc.)
      fragranceTypes: ['edp', 'edt', 'parfum', 'extrait'],
      maxPrice: Math.ceil(maxPrice / 100) * 100 || 1000,
    };
  }, [products]);

  // Set initial price range based on products
  useEffect(() => {
    if (filterOptions.maxPrice > 0) {
      setPriceRange([0, filterOptions.maxPrice]);
    }
  }, [filterOptions.maxPrice]);

  // Client-side filtering only for size and price (these can't be done server-side efficiently)
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products.filter((p) => {
      const node = p.node;

      // Size filter (client-side - variant-based)
      if (selectedSizes.length > 0) {
        const productSizes = getProductSizes(node);
        if (!productSizes.some(size => selectedSizes.includes(size))) {
          return false;
        }
      }

      // Price filter (client-side for precise range)
      const price = parseFloat(node.priceRange.minVariantPrice.amount);
      if (price < priceRange[0] || price > priceRange[1]) {
        return false;
      }

      return true;
    });

    return filtered;
  }, [products, selectedSizes, priceRange]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedGenders.length === 1) params.set("gender", selectedGenders[0]);
    if (selectedVendors.length === 1) params.set("vendor", selectedVendors[0]);
    if (sortBy !== "bestselling") params.set("sort", sortBy);
    if (initialSeason) params.set("season", initialSeason);
    if (initialCollection) params.set("collection", initialCollection);
    setSearchParams(params, { replace: true });
  }, [selectedGenders, selectedVendors, sortBy, setSearchParams, initialSeason, initialCollection]);

  const handleReset = () => {
    setSelectedVendors([]);
    setSelectedGenders([]);
    setSelectedFragranceTypes([]);
    setSelectedSizes([]);
    setPriceRange([0, filterOptions.maxPrice]);
  };

  const toggleFilter = (value: string, selected: string[], setter: (v: string[]) => void) => {
    if (selected.includes(value)) {
      setter(selected.filter(v => v !== value));
    } else {
      setter([...selected, value]);
    }
  };

  const activeFilterCount =
    selectedVendors.length +
    selectedGenders.length +
    selectedFragranceTypes.length +
    selectedSizes.length +
    (priceRange[0] > 0 || priceRange[1] < filterOptions.maxPrice ? 1 : 0);

  // Page title based on filters
  const getPageTitle = () => {
    if (initialVendor) return initialVendor;
    if (initialGender === 'men') return 'Muški parfemi';
    if (initialGender === 'women') return 'Ženski parfemi';
    if (initialGender === 'unisex') return 'Unisex parfemi';
    if (initialSeason === 'summer') return 'Ljetna kolekcija';
    if (initialCollection === 'signature') return 'Signature kolekcija';
    return 'Svi parfemi';
  };

  const FilterContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`space-y-6 ${isMobile ? 'p-6' : ''}`}>
      {isMobile && (
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h3 className="font-display text-lg">Filteri</h3>
          <button onClick={() => setIsMobileFilterOpen(false)}>
            <X size={20} />
          </button>
        </div>
      )}

      {/* Vendors / Brands */}
      {vendors && vendors.length > 0 && (
        <div>
          <h4 className="font-display text-sm mb-3">Brend</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {vendors.sort().map((vendor) => (
              <label key={vendor} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectedVendors.includes(vendor)}
                  onCheckedChange={() => toggleFilter(vendor, selectedVendors, setSelectedVendors)}
                />
                <span className="font-body text-sm">{vendor}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Gender */}
      <div>
        <h4 className="font-display text-sm mb-3">Spol</h4>
        <div className="space-y-2">
          {['men', 'women', 'unisex'].map((gender) => (
            <label key={gender} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedGenders.includes(gender)}
                onCheckedChange={() => toggleFilter(gender, selectedGenders, setSelectedGenders)}
              />
              <span className="font-body text-sm">
                {gender === 'men' ? 'Muški' : gender === 'women' ? 'Ženski' : 'Unisex'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Fragrance Type */}
      {filterOptions.fragranceTypes.length > 0 && (
        <div>
          <h4 className="font-display text-sm mb-3">Tip parfema</h4>
          <div className="space-y-2">
            {filterOptions.fragranceTypes.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectedFragranceTypes.includes(type)}
                  onCheckedChange={() => toggleFilter(type, selectedFragranceTypes, setSelectedFragranceTypes)}
                />
                <span className="font-body text-sm uppercase">{type}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {filterOptions.sizes.length > 0 && (
        <div>
          <h4 className="font-display text-sm mb-3">Veličina</h4>
          <div className="flex flex-wrap gap-2">
            {filterOptions.sizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleFilter(size, selectedSizes, setSelectedSizes)}
                className={`px-3 py-1 text-sm font-body border transition-colors ${
                  selectedSizes.includes(size)
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border hover:border-foreground'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h4 className="font-display text-sm mb-3">Cijena</h4>
        <div className="px-2">
          <div className="relative h-6 mb-3">
            <input
              type="range"
              min={0}
              max={filterOptions.maxPrice}
              value={priceRange[0]}
              onChange={(e) => {
                const newMin = Math.min(Number(e.target.value), priceRange[1] - 10);
                setPriceRange([newMin, priceRange[1]]);
              }}
              className="absolute w-full h-1.5 bg-transparent appearance-none pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-foreground [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-foreground [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:active:cursor-grabbing"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="range"
              min={0}
              max={filterOptions.maxPrice}
              value={priceRange[1]}
              onChange={(e) => {
                const newMax = Math.max(Number(e.target.value), priceRange[0] + 10);
                setPriceRange([priceRange[0], newMax]);
              }}
              className="absolute w-full h-1.5 bg-transparent appearance-none pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-foreground [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-foreground [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:active:cursor-grabbing"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            />
            {/* Track background */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 bg-border rounded-full z-10" />
            {/* Active range */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-foreground rounded-full z-10"
              style={{
                left: `${(priceRange[0] / filterOptions.maxPrice) * 100}%`,
                right: `${100 - (priceRange[1] / filterOptions.maxPrice) * 100}%`
              }}
            />
          </div>
          <div className="flex justify-between font-body text-sm text-muted-foreground">
            <span>€{priceRange[0]}</span>
            <span>€{priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      {activeFilterCount > 0 && (
        <button
          onClick={handleReset}
          className="w-full py-2 font-body text-sm text-accent hover:text-accent/80 transition-colors"
        >
          Resetiraj filtere ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <Layout>
      {/* Page Header */}
      <section className="py-12 md:py-16 border-b border-border">
        <div className="container-montis">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-wide text-center">
            {getPageTitle()}
          </h1>
          <p className="font-body text-muted-foreground text-center mt-2">
            {isLoading ? 'Učitavanje...' : `${filteredProducts.length} proizvoda`}
          </p>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container-montis py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Filter Toggle */}
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden flex items-center gap-2 font-body text-sm tracking-wide">
                  <SlidersHorizontal size={18} />
                  Filteri
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 bg-accent text-accent-foreground text-xs flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-sm p-0 bg-background">
                <FilterContent isMobile />
              </SheetContent>
            </Sheet>

            {/* Active Filters Pills - Desktop */}
            <div className="hidden lg:flex items-center gap-2 flex-wrap">
              {selectedVendors.map((vendor) => (
                <button
                  key={vendor}
                  onClick={() => toggleFilter(vendor, selectedVendors, setSelectedVendors)}
                  className="flex items-center gap-1 px-3 py-1 bg-foreground text-background font-body text-xs"
                >
                  {vendor}
                  <X size={12} />
                </button>
              ))}
              {selectedGenders.map((gender) => (
                <button
                  key={gender}
                  onClick={() => toggleFilter(gender, selectedGenders, setSelectedGenders)}
                  className="flex items-center gap-1 px-3 py-1 bg-foreground text-background font-body text-xs"
                >
                  {gender === 'men' ? 'Muški' : gender === 'women' ? 'Ženski' : 'Unisex'}
                  <X size={12} />
                </button>
              ))}
              {selectedFragranceTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleFilter(type, selectedFragranceTypes, setSelectedFragranceTypes)}
                  className="flex items-center gap-1 px-3 py-1 bg-foreground text-background font-body text-xs"
                >
                  {type}
                  <X size={12} />
                </button>
              ))}
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Sortiraj" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="bestselling">Najprodavanije</SelectItem>
                <SelectItem value="newest">Najnovije</SelectItem>
                <SelectItem value="price-asc">Cijena: niža prvo</SelectItem>
                <SelectItem value="price-desc">Cijena: viša prvo</SelectItem>
                <SelectItem value="title">Naziv</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container-montis">
          <div className="flex gap-12">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-40">
                <FilterContent />
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="font-display text-xl text-muted-foreground mb-4">
                    Nema proizvoda koji odgovaraju vašim filterima
                  </p>
                  <button
                    onClick={handleReset}
                    className="font-body text-sm text-accent hover:text-accent/80 transition-colors"
                  >
                    Resetiraj filtere
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <ShopifyProductCard key={product.node.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Collection;
