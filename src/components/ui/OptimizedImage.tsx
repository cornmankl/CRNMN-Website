import React, { useState } from 'react';
import { useImageLazyLoading } from '../../hooks/useLazyLoading';
import { generateImagePlaceholder } from '../../utils/imageOptimization';
import { cn } from '../../utils/cn';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 300,
  className,
  placeholder,
  priority = false,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);
  const imagePlaceholder = placeholder || generateImagePlaceholder(width, height);
  
  const { ref, imageSrc, isLoaded } = useImageLazyLoading(
    priority ? src : '',
    imagePlaceholder
  );

  const handleLoad = () => {
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div 
        className={cn(
          "bg-[var(--neutral-700)] flex items-center justify-center text-[var(--neutral-400)]",
          className
        )}
        style={{ width, height }}
      >
        <span className="text-4xl">🌽</span>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        loading={priority ? "eager" : "lazy"}
      />
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-[var(--neutral-700)] flex items-center justify-center animate-pulse"
          style={{ width, height }}
        >
          <span className="text-4xl">🌽</span>
        </div>
      )}
    </div>
  );
}
