import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import montisIkona from "@/assets/montis-ikona.png";
import CartDrawer from "@/components/cart/CartDrawer";
import { useVendors } from "@/hooks/useShopifyProducts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { data: vendors } = useVendors();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  const mainNavLinks = [
    { href: "/", label: "Početna" },
    { href: "/kolekcija", label: "Svi parfemi" },
  ];

  const genderLinks = [
    { href: "/kolekcija?gender=men", label: "Muški parfemi" },
    { href: "/kolekcija?gender=women", label: "Ženski parfemi" },
    { href: "/kolekcija?gender=unisex", label: "Unisex parfemi" },
  ];

  // Handle navigation with scroll to top (for dropdown links)
  const handleNavigate = (href: string) => {
    navigate(href);
    window.scrollTo(0, 0);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="container-montis">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 -ml-2"
            aria-label="Meni"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`nav-link ${
                  location.pathname === link.href ? "text-foreground" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Gender Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="nav-link flex items-center gap-1">
                Kategorije <ChevronDown size={14} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border min-w-[180px]">
                {genderLinks.map((link) => (
                  <DropdownMenuItem 
                    key={link.href} 
                    onClick={() => handleNavigate(link.href)}
                    className="w-full cursor-pointer"
                  >
                    {link.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Brands Dropdown */}
            {vendors && vendors.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger className="nav-link flex items-center gap-1">
                  Brendovi <ChevronDown size={14} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background border border-border min-w-[200px] max-h-[400px] overflow-y-auto">
                  {vendors.sort().map((vendor) => (
                    <DropdownMenuItem 
                      key={vendor} 
                      onClick={() => handleNavigate(`/kolekcija?vendor=${encodeURIComponent(vendor)}`)}
                      className="w-full cursor-pointer"
                    >
                      {vendor}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Logo */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2"
          >
            <img src={montisIkona} alt="" className="h-8 md:h-10 w-auto" />
            <span className="font-display text-xl md:text-2xl tracking-wider">Montis</span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:opacity-70 transition-opacity"
              aria-label="Pretraga"
            >
              <Search size={20} />
            </button>
            <CartDrawer />
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-border/50 animate-fade-in">
            <input
              type="text"
              placeholder="Pretraži parfeme..."
              className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-foreground transition-colors"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border/50 animate-fade-in">
          <nav className="container-montis py-6 flex flex-col gap-1">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`nav-link py-3 ${
                  location.pathname === link.href ? "text-foreground" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="border-t border-border/30 my-2" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider py-2">Kategorije</p>
            {genderLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="nav-link py-3 pl-2"
              >
                {link.label}
              </Link>
            ))}

            {vendors && vendors.length > 0 && (
              <>
                <div className="border-t border-border/30 my-2" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider py-2">Brendovi</p>
                {vendors.sort().slice(0, 10).map((vendor) => (
                  <Link
                    key={vendor}
                    to={`/kolekcija?vendor=${encodeURIComponent(vendor)}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="nav-link py-3 pl-2"
                  >
                    {vendor}
                  </Link>
                ))}
                {vendors.length > 10 && (
                  <Link
                    to="/kolekcija"
                    onClick={() => setIsMenuOpen(false)}
                    className="nav-link py-3 pl-2 text-accent"
                  >
                    Svi brendovi →
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
