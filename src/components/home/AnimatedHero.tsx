import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const AnimatedHero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <section 
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-obsidian"
      onMouseMove={handleMouseMove}
    >
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(
              circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              hsl(var(--gold) / 0.3) 0%, 
              transparent 50%
            ),
            radial-gradient(
              circle at ${100 - mousePosition.x * 100}% ${100 - mousePosition.y * 100}%, 
              hsl(var(--primary) / 0.2) 0%, 
              transparent 40%
            )
          `,
          transition: 'background 0.3s ease-out',
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Decorative circles */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full border border-gold/10"
        style={{
          transform: `translate(${mousePosition.x * 20 - 10}px, ${mousePosition.y * 20 - 10}px)`,
          transition: 'transform 0.5s ease-out',
        }}
      />
      <div 
        className="absolute w-[400px] h-[400px] rounded-full border border-gold/20"
        style={{
          transform: `translate(${mousePosition.x * -30 + 15}px, ${mousePosition.y * -30 + 15}px)`,
          transition: 'transform 0.5s ease-out',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Subtitle */}
        <div 
          className={`transform transition-all duration-1000 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block text-gold/80 tracking-[0.3em] uppercase text-sm font-light mb-6">
            Ekskluzivna kolekcija
          </span>
        </div>

        {/* Main heading */}
        <h1 
          className={`font-display text-5xl md:text-7xl lg:text-8xl text-bone mb-6 transform transition-all duration-1000 delay-500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="block">Pronađi svoj</span>
          <span className="block mt-2 bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
            potpis mirisa
          </span>
        </h1>

        {/* Description */}
        <p 
          className={`text-bone/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light transform transition-all duration-1000 delay-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Otkrijte svijet luksuznih parfema iz najpoznatijih svjetskih kuća
        </p>

        {/* CTA Buttons */}
        <div 
          className={`flex flex-col sm:flex-row gap-4 justify-center transform transition-all duration-1000 delay-900 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link 
            to="/collection" 
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold text-obsidian font-medium tracking-wide overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          >
            <span className="relative z-10">Istraži kolekciju</span>
            <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-gold-light transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
          </Link>
          
          <Link 
            to="/collection?category=new" 
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 border border-bone/30 text-bone font-medium tracking-wide transition-all duration-300 hover:border-gold hover:text-gold"
          >
            <span>Nove kolekcije</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Bottom indicator */}
        <div 
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transform transition-all duration-1000 delay-1100 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex flex-col items-center gap-2 text-bone/40">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-bone/40 to-transparent animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedHero;
