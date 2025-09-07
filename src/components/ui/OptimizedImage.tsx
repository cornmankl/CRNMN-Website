import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
  loading?: "lazy" | "eager";
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder = "empty",
  blurDataURL,
  sizes = "100vw",
  quality = 75,
  loading = "lazy",
  onLoad,
  onError,
  fallbackSrc = "/images/placeholder.jpg",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === "eager") {
      setIsInView(true);
      return;
    }

    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    onError?.();
  };

  const imageSrc = isError ? fallbackSrc : src;

  return (
    <div
      ref={imgRef}
      className={cn("relative overflow-hidden", className)}
      style={{ width, height }}
    >
      {/* Loading skeleton */}
      {!isLoaded && placeholder === "empty" && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            "w-full h-full object-cover"
          )}
          style={{
            aspectRatio: width && height ? `${width}/${height}` : undefined,
          }}
        />
      )}

      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-500">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs">Failed to load</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
