import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export type SortOption = "popular" | "newest" | "price-asc" | "price-desc";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Najpopularnije" },
  { value: "newest", label: "Najnovije" },
  { value: "price-asc", label: "Cijena: niža → viša" },
  { value: "price-desc", label: "Cijena: viša → niža" },
];

const SortDropdown = ({ value, onChange }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLabel = sortOptions.find((opt) => opt.value === value)?.label;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 font-body text-sm tracking-wide text-foreground hover:text-muted-foreground transition-colors"
      >
        <span className="text-muted-foreground">Sortiraj:</span>
        <span className="font-medium">{currentLabel}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-background border border-border shadow-lg min-w-[200px] z-20 animate-fade-in">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 font-body text-sm transition-colors ${
                value === option.value
                  ? "bg-foreground text-background"
                  : "text-foreground hover:bg-bone-light"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
