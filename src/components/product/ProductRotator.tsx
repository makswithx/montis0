import { useState, useRef, useCallback } from "react";
import { RotateCcw } from "lucide-react";

interface ProductRotatorProps {
  images: string[];
  productName: string;
}

const ProductRotator = ({ images, productName }: ProductRotatorProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const lastIndexRef = useRef(0);

  const handleDragStart = useCallback((clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
    lastIndexRef.current = currentIndex;
  }, [currentIndex]);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const deltaX = clientX - startXRef.current;
    const sensitivity = containerWidth / images.length;
    const indexChange = Math.round(deltaX / sensitivity);
    
    let newIndex = lastIndexRef.current - indexChange;
    // Loop around
    while (newIndex < 0) newIndex += images.length;
    while (newIndex >= images.length) newIndex -= images.length;
    
    setCurrentIndex(newIndex);
  }, [isDragging, images.length]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={`aspect-[3/4] bg-bone-light overflow-hidden select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentIndex]}
          alt={`${productName} - pogled ${currentIndex + 1}`}
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Rotation indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-body text-muted-foreground">
        <RotateCcw size={14} className={isDragging ? "animate-spin" : ""} />
        <span>Povucite za rotaciju</span>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === index
                ? "bg-foreground w-4"
                : "bg-foreground/30 hover:bg-foreground/50"
            }`}
            aria-label={`Pogled ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductRotator;
