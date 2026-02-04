
import React, { useState, useEffect } from 'react';
import { offlineService } from '../services/offlineService';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  aspectRatio?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  priority = false,
  aspectRatio = "aspect-square"
}) => {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const loadImage = async () => {
      // Optimizamos la URL de Unsplash para la descarga inicial
      const targetSrc = src.includes('images.unsplash.com') 
        ? `${src.split('?')[0]}?auto=format&fit=crop&q=85&w=${priority ? 1920 : 800}`
        : src;

      // Intentamos obtener versión cacheada (filesystem)
      const cached = await offlineService.getCachedImage(targetSrc);
      
      if (isMounted) {
        setImageSrc(cached);
      }
    };

    loadImage();
    return () => { isMounted = false; };
  }, [src, priority]);

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className} bg-mnac-gray/20`}>
      {/* Shimmer/Placeholder Effect */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer bg-[length:200%_100%]"></div>
      )}
      
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          className={`
            absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
        />
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-xs text-center p-4">
          <span className="opacity-50">Imagen no disponible offline</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
