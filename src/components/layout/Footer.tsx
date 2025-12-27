import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16 mt-20">
      <div className="container-eleya">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="font-display text-3xl tracking-[0.15em]">
              ELEYA
            </Link>
            <p className="mt-4 font-body text-sm text-background/70 max-w-sm leading-relaxed">
              Vaša destinacija za ekskluzivne parfeme. Više od 3.500 originalnih mirisa 
              iz cijeloga svijeta.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg tracking-wide mb-4">Navigacija</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="font-body text-sm text-background/70 hover:text-background transition-colors">
                Početna
              </Link>
              <Link to="/kolekcija" className="font-body text-sm text-background/70 hover:text-background transition-colors">
                Kolekcija
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg tracking-wide mb-4">Kontakt</h4>
            <div className="flex flex-col gap-2 font-body text-sm text-background/70">
              <p>info@eleya.me</p>
              <p>+382 XX XXX XXX</p>
              <p>Podgorica, Crna Gora</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-background/50">
            © {new Date().getFullYear()} ELEYA. Sva prava zadržana.
          </p>
          <div className="flex gap-6">
            <Link to="/" className="font-body text-xs text-background/50 hover:text-background transition-colors">
              Politika privatnosti
            </Link>
            <Link to="/" className="font-body text-xs text-background/50 hover:text-background transition-colors">
              Uslovi korištenja
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
