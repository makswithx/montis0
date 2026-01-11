import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import heroVideo from '@/assets/hero-video.mp4';

const VideoHero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative h-[100vh] min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-obsidian/30" />
        <div className="absolute inset-0 bg-obsidian/40" />
      </div>

      {/* Mute/Unmute button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-8 right-8 z-20 p-3 bg-bone/10 backdrop-blur-sm border border-bone/20 text-bone/70 hover:text-bone hover:bg-bone/20 transition-all duration-300"
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Subtitle */}
        <div 
          className={`transform transition-all duration-1000 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block text-gold tracking-[0.4em] uppercase text-xs md:text-sm font-light mb-6 border-b border-gold/30 pb-2">
            Luksuzna parfimerija
          </span>
        </div>

        {/* Main heading */}
        <h1 
          className={`font-display text-5xl md:text-7xl lg:text-8xl text-bone mb-8 transform transition-all duration-1000 delay-500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="block leading-tight">Elegancija</span>
          <span className="block leading-tight text-gold mt-2">u svakoj kapi</span>
        </h1>

        {/* Description */}
        <p 
          className={`text-bone/70 text-lg md:text-xl max-w-xl mx-auto mb-12 font-light leading-relaxed transform transition-all duration-1000 delay-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Otkrijte najekskluzivnije parfeme iz prestižnih svjetskih kuća
        </p>

        {/* CTA Buttons */}
        <div 
          className={`flex flex-col sm:flex-row gap-5 justify-center transform transition-all duration-1000 delay-900 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link 
            to="/collection" 
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-gold text-obsidian font-medium tracking-widest uppercase text-sm overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.5)]"
          >
            <span className="relative z-10">Istraži</span>
            <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-bone transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
          </Link>
          
          <Link 
            to="/collection?category=new" 
            className="group inline-flex items-center justify-center gap-3 px-10 py-4 border border-bone/40 text-bone font-medium tracking-widest uppercase text-sm transition-all duration-500 hover:border-gold hover:text-gold backdrop-blur-sm"
          >
            <span>Noviteti</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-obsidian to-transparent z-[5]" />

      {/* Scroll indicator */}
      <div 
        className={`absolute bottom-12 left-1/2 -translate-x-1/2 z-10 transform transition-all duration-1000 delay-1100 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-bone/50 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default VideoHero;
