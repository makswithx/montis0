import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/product/ProductCard";
import FilterSidebar from "@/components/collection/FilterSidebar";
import SortDropdown, { SortOption } from "@/components/collection/SortDropdown";
import { products, filterOptions, collections } from "@/data/products";
import { SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Collection = () => {
  const [searchParams] = useSearchParams();
  const initialGender = searchParams.get("gender");
  const initialCollection = searchParams.get("collection");

  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [selectedFilters, setSelectedFilters] = useState({
    brands: [] as string[],
    types: [] as string[],
    genders: initialGender ? [initialGender] : ([] as string[]),
    volumes: [] as string[],
    priceRange: filterOptions.priceRange as [number, number],
    collection: initialCollection || "",
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleFilterChange = (filterType: string, value: string | [number, number]) => {
    if (filterType === "priceRange") {
      setSelectedFilters((prev) => ({
        ...prev,
        priceRange: value as [number, number],
      }));
    } else if (filterType === "collection") {
      setSelectedFilters((prev) => ({
        ...prev,
        collection: prev.collection === value ? "" : (value as string),
      }));
    } else {
      const key = filterType as keyof typeof selectedFilters;
      if (key !== "priceRange" && key !== "collection") {
        setSelectedFilters((prev) => {
          const current = prev[key] as string[];
          const valueStr = value as string;
          return {
            ...prev,
            [key]: current.includes(valueStr)
              ? current.filter((v) => v !== valueStr)
              : [...current, valueStr],
          };
        });
      }
    }
  };

  const handleReset = () => {
    setSelectedFilters({
      brands: [],
      types: [],
      genders: [],
      volumes: [],
      priceRange: filterOptions.priceRange,
      collection: "",
    });
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Brand filter
      if (
        selectedFilters.brands.length > 0 &&
        !selectedFilters.brands.includes(product.brand)
      ) {
        return false;
      }

      // Type filter
      if (
        selectedFilters.types.length > 0 &&
        !selectedFilters.types.includes(product.type)
      ) {
        return false;
      }

      // Gender filter
      if (
        selectedFilters.genders.length > 0 &&
        !selectedFilters.genders.includes(product.gender)
      ) {
        return false;
      }

      // Volume filter
      if (
        selectedFilters.volumes.length > 0 &&
        !selectedFilters.volumes.includes(product.volume)
      ) {
        return false;
      }

      // Collection filter
      if (
        selectedFilters.collection &&
        product.collection !== selectedFilters.collection
      ) {
        return false;
      }

      // Price filter
      if (
        product.price < selectedFilters.priceRange[0] ||
        product.price > selectedFilters.priceRange[1]
      ) {
        return false;
      }

      return true;
    });
  }, [selectedFilters]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case "newest":
        return sorted.reverse();
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "popular":
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  const activeFilterCount =
    selectedFilters.brands.length +
    selectedFilters.types.length +
    selectedFilters.genders.length +
    selectedFilters.volumes.length +
    (selectedFilters.collection ? 1 : 0) +
    (selectedFilters.priceRange[0] !== filterOptions.priceRange[0] ||
    selectedFilters.priceRange[1] !== filterOptions.priceRange[1]
      ? 1
      : 0);

  const currentCollection = collections.find(c => c.slug === selectedFilters.collection);

  return (
    <Layout>
      {/* Page Header */}
      <section className="py-12 md:py-16 border-b border-border">
        <div className="container-eleya">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-wide text-center">
            {currentCollection ? currentCollection.name : "Kolekcija"}
          </h1>
          {currentCollection && (
            <p className="font-body text-muted-foreground text-center mt-3">
              {currentCollection.description}
            </p>
          )}
          <p className="font-body text-muted-foreground text-center mt-2">
            {sortedProducts.length} proizvoda
          </p>
        </div>
      </section>

      {/* Collection Quick Filters */}
      <section className="border-b border-border">
        <div className="container-eleya py-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => handleFilterChange("collection", "")}
              className={`px-4 py-2 font-body text-sm tracking-wide transition-colors ${
                !selectedFilters.collection
                  ? "bg-foreground text-background"
                  : "bg-transparent text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              Sve
            </button>
            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => handleFilterChange("collection", collection.slug)}
                className={`px-4 py-2 font-body text-sm tracking-wide transition-colors ${
                  selectedFilters.collection === collection.slug
                    ? "bg-foreground text-background"
                    : "bg-transparent text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {collection.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container-eleya py-4">
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
                <FilterSidebar
                  filters={filterOptions}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                  onReset={handleReset}
                  isMobile
                  onClose={() => setIsMobileFilterOpen(false)}
                />
              </SheetContent>
            </Sheet>

            {/* Active Filters Pills - Desktop */}
            <div className="hidden lg:flex items-center gap-2 flex-wrap">
              {selectedFilters.brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => handleFilterChange("brands", brand)}
                  className="flex items-center gap-1 px-3 py-1 bg-foreground text-background font-body text-xs"
                >
                  {brand}
                  <X size={12} />
                </button>
              ))}
              {selectedFilters.genders.map((gender) => (
                <button
                  key={gender}
                  onClick={() => handleFilterChange("genders", gender)}
                  className="flex items-center gap-1 px-3 py-1 bg-foreground text-background font-body text-xs"
                >
                  {gender}
                  <X size={12} />
                </button>
              ))}
              {selectedFilters.types.map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterChange("types", type)}
                  className="flex items-center gap-1 px-3 py-1 bg-foreground text-background font-body text-xs"
                >
                  {type}
                  <X size={12} />
                </button>
              ))}
            </div>

            {/* Sort */}
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container-eleya">
          <div className="flex gap-12">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-40">
                <FilterSidebar
                  filters={filterOptions}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                  onReset={handleReset}
                />
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              {sortedProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="font-display text-xl text-muted-foreground mb-4">
                    Nema proizvoda koji odgovaraju vašim filterima
                  </p>
                  <button
                    onClick={handleReset}
                    className="font-body text-sm text-accent hover:text-accent/80 transition-colors"
                  >
                    Resetuj filtere
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
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
