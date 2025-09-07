import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
  rounded = true,
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        rounded && 'rounded',
        className
      )}
      style={{ width, height }}
    />
  );
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'primary' | 'secondary' | 'white';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  color = 'primary',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
  };

  return (
    <div
      className={cn(
        'animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    >
      <svg
        className="w-full h-full"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

interface LoadingDotsProps {
  className?: string;
  color?: 'primary' | 'secondary' | 'white';
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  className,
  color = 'primary',
}) => {
  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    white: 'bg-white',
  };

  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'w-2 h-2 rounded-full animate-bounce',
            colorClasses[color]
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};

interface LoadingBarProps {
  progress?: number;
  className?: string;
  showPercentage?: boolean;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({
  progress = 0,
  className,
  showPercentage = false,
}) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-sm text-gray-600 mt-1 text-center">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

interface LoadingCardProps {
  className?: string;
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  lines?: number;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  className,
  showImage = true,
  showTitle = true,
  showDescription = true,
  lines = 3,
}) => {
  return (
    <div className={cn('p-4 border rounded-lg', className)}>
      {showImage && (
        <Skeleton className="w-full h-48 mb-4" />
      )}
      {showTitle && (
        <Skeleton className="h-6 w-3/4 mb-2" />
      )}
      {showDescription && (
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
              key={i}
              className={cn(
                'h-4',
                i === lines - 1 ? 'w-1/2' : 'w-full'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface LoadingGridProps {
  items?: number;
  className?: string;
  itemClassName?: string;
}

export const LoadingGrid: React.FC<LoadingGridProps> = ({
  items = 6,
  className,
  itemClassName,
}) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <LoadingCard key={i} className={itemClassName} />
      ))}
    </div>
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  spinner?: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  className,
  spinner = true,
  message,
}) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className={cn('relative', className)}>
      {children}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
        <div className="text-center">
          {spinner && <LoadingSpinner size="lg" className="mx-auto mb-4" />}
          {message && (
            <p className="text-gray-600 text-sm">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  loadingText?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  className,
  disabled,
  onClick,
  loadingText = 'Loading...',
}) => {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        'bg-blue-600 text-white hover:bg-blue-700',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'flex items-center justify-center space-x-2',
        className
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" color="white" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default {
  Skeleton,
  LoadingSpinner,
  LoadingDots,
  LoadingBar,
  LoadingCard,
  LoadingGrid,
  LoadingOverlay,
  LoadingButton,
};
