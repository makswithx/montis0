import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterSidebarProps {
  filters: {
    brands: string[];
    types: string[];
    genders: string[];
    volumes: string[];
    priceRange: [number, number];
  };
  selectedFilters: {
    brands: string[];
    types: string[];
    genders: string[];
    volumes: string[];
    priceRange: [number, number];
  };
  onFilterChange: (filterType: string, value: string | [number, number]) => void;
  onReset: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FilterSection = ({ title, isOpen, onToggle, children }: FilterSectionProps) => (
  <div className="border-b border-border py-4">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between filter-label"
    >
      {title}
      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </button>
    {isOpen && <div className="mt-4 space-y-3">{children}</div>}
  </div>
);

const FilterSidebar = ({
  filters,
  selectedFilters,
  onFilterChange,
  onReset,
  isMobile = false,
  onClose,
}: FilterSidebarProps) => {
  const [openSections, setOpenSections] = useState({
    brand: true,
    price: true,
    gender: true,
    type: true,
    volume: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const hasActiveFilters =
    selectedFilters.brands.length > 0 ||
    selectedFilters.types.length > 0 ||
    selectedFilters.genders.length > 0 ||
    selectedFilters.volumes.length > 0 ||
    selectedFilters.priceRange[0] !== filters.priceRange[0] ||
    selectedFilters.priceRange[1] !== filters.priceRange[1];

  const priceRanges = [
    { label: "Do €50", value: [0, 50] },
    { label: "€50 - €100", value: [50, 100] },
    { label: "€100 - €200", value: [100, 200] },
    { label: "Preko €200", value: [200, 1000] },
  ];

  return (
    <aside className={`${isMobile ? "p-6" : ""}`}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <h2 className="font-display text-xl tracking-wide">Filteri</h2>
          <button onClick={onClose} aria-label="Zatvori">
            <X size={24} />
          </button>
        </div>
      )}

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="font-body text-sm text-accent hover:text-accent/80 transition-colors mb-4 flex items-center gap-2"
        >
          <X size={14} />
          Resetuj filtere
        </button>
      )}

      {/* Brand Filter */}
      <FilterSection
        title="Brend"
        isOpen={openSections.brand}
        onToggle={() => toggleSection("brand")}
      >
        <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
          {filters.brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={selectedFilters.brands.includes(brand)}
                onCheckedChange={() => onFilterChange("brands", brand)}
              />
              <span className="font-body text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Filter */}
      <FilterSection
        title="Cijena"
        isOpen={openSections.price}
        onToggle={() => toggleSection("price")}
      >
        <div className="space-y-4">
          {/* Quick Ranges */}
          <div className="flex flex-wrap gap-2">
            {priceRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => onFilterChange("priceRange", range.value as [number, number])}
                className={`px-3 py-1.5 border font-body text-xs transition-colors ${
                  selectedFilters.priceRange[0] === range.value[0] &&
                  selectedFilters.priceRange[1] === range.value[1]
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Price Inputs */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <input
                type="number"
                min={filters.priceRange[0]}
                max={selectedFilters.priceRange[1]}
                value={selectedFilters.priceRange[0]}
                onChange={(e) => {
                  const val = Math.max(filters.priceRange[0], Math.min(Number(e.target.value), selectedFilters.priceRange[1]));
                  onFilterChange("priceRange", [val, selectedFilters.priceRange[1]]);
                }}
                className="w-full px-3 py-2 border border-border bg-background font-body text-sm focus:outline-none focus:border-foreground"
                placeholder="Min"
              />
            </div>
            <span className="font-body text-muted-foreground">—</span>
            <div className="flex-1">
              <input
                type="number"
                min={selectedFilters.priceRange[0]}
                max={filters.priceRange[1]}
                value={selectedFilters.priceRange[1]}
                onChange={(e) => {
                  const val = Math.max(selectedFilters.priceRange[0], Math.min(Number(e.target.value), filters.priceRange[1]));
                  onFilterChange("priceRange", [selectedFilters.priceRange[0], val]);
                }}
                className="w-full px-3 py-2 border border-border bg-background font-body text-sm focus:outline-none focus:border-foreground"
                placeholder="Max"
              />
            </div>
            <span className="font-body text-sm text-muted-foreground">€</span>
          </div>
        </div>
      </FilterSection>

      {/* Gender Filter */}
      <FilterSection
        title="Pol"
        isOpen={openSections.gender}
        onToggle={() => toggleSection("gender")}
      >
        {filters.genders.map((gender) => (
          <label
            key={gender}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <Checkbox
              checked={selectedFilters.genders.includes(gender)}
              onCheckedChange={() => onFilterChange("genders", gender)}
            />
            <span className="font-body text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {gender}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Type Filter */}
      <FilterSection
        title="Tip mirisa"
        isOpen={openSections.type}
        onToggle={() => toggleSection("type")}
      >
        {filters.types.map((type) => (
          <label
            key={type}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <Checkbox
              checked={selectedFilters.types.includes(type)}
              onCheckedChange={() => onFilterChange("types", type)}
            />
            <span className="font-body text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {type}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Volume Filter */}
      <FilterSection
        title="Zapremina"
        isOpen={openSections.volume}
        onToggle={() => toggleSection("volume")}
      >
        {filters.volumes.map((volume) => (
          <label
            key={volume}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <Checkbox
              checked={selectedFilters.volumes.includes(volume)}
              onCheckedChange={() => onFilterChange("volumes", volume)}
            />
            <span className="font-body text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {volume}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Mobile Apply Button */}
      {isMobile && (
        <div className="mt-8">
          <button
            onClick={onClose}
            className="w-full btn-gold text-center"
          >
            Primijeni filtere
          </button>
        </div>
      )}
    </aside>
  );
};

export default FilterSidebar;
