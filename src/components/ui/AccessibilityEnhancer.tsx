import React, { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';

interface AccessibilityEnhancerProps {
  children: React.ReactNode;
  className?: string;
}

export const AccessibilityEnhancer: React.FC<AccessibilityEnhancerProps> = ({
  children,
  className,
}) => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    // Check for high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      setIsHighContrast(true);
    }

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsReducedMotion(true);
    }

    // Listen for preference changes
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    contrastQuery.addEventListener('change', handleContrastChange);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      contrastQuery.removeEventListener('change', handleContrastChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <div
      className={cn(
        'accessibility-enhanced',
        isHighContrast && 'high-contrast',
        isReducedMotion && 'reduced-motion',
        className
      )}
      style={{
        fontSize: `${fontSize}px`,
        '--font-size': `${fontSize}px`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
  className?: string;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  isActive,
  className,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  href,
  children,
  className,
}) => {
  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4',
        'bg-blue-600 text-white px-4 py-2 rounded-lg z-50',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        className
      )}
    >
      {children}
    </a>
  );
};

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  className?: string;
}

export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({
  children,
  className,
}) => {
  return (
    <span className={cn('sr-only', className)}>
      {children}
    </span>
  );
};

interface VisuallyHiddenProps {
  children: React.ReactNode;
  className?: string;
}

export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({
  children,
  className,
}) => {
  return (
    <span
      className={cn(
        'absolute w-px h-px p-0 -m-px overflow-hidden',
        'whitespace-nowrap border-0',
        'clip-path-inset-50',
        className
      )}
    >
      {children}
    </span>
  );
};

interface AriaLiveRegionProps {
  children: React.ReactNode;
  className?: string;
  politeness?: 'polite' | 'assertive' | 'off';
}

export const AriaLiveRegion: React.FC<AriaLiveRegionProps> = ({
  children,
  className,
  politeness = 'polite',
}) => {
  return (
    <div
      className={cn('sr-only', className)}
      aria-live={politeness}
      aria-atomic="true"
    >
      {children}
    </div>
  );
};

interface KeyboardNavigationProps {
  children: React.ReactNode;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  className?: string;
}

export const KeyboardNavigation: React.FC<KeyboardNavigationProps> = ({
  children,
  onKeyDown,
  className,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle common keyboard navigation patterns
    switch (e.key) {
      case 'Enter':
      case ' ':
        if (e.target instanceof HTMLElement && e.target.getAttribute('role') === 'button') {
          e.preventDefault();
          e.target.click();
        }
        break;
      case 'Escape':
        // Close modals, dropdowns, etc.
        const closeButton = document.querySelector('[data-close]') as HTMLElement;
        closeButton?.click();
        break;
      case 'ArrowDown':
        // Navigate to next item in lists
        const nextElement = e.target instanceof HTMLElement 
          ? e.target.nextElementSibling as HTMLElement
          : null;
        nextElement?.focus();
        break;
      case 'ArrowUp':
        // Navigate to previous item in lists
        const prevElement = e.target instanceof HTMLElement 
          ? e.target.previousElementSibling as HTMLElement
          : null;
        prevElement?.focus();
        break;
    }

    onKeyDown?.(e);
  };

  return (
    <div
      className={className}
      onKeyDown={handleKeyDown}
      role="application"
      tabIndex={-1}
    >
      {children}
    </div>
  );
};

interface ColorContrastCheckerProps {
  backgroundColor: string;
  textColor: string;
  children: React.ReactNode;
  className?: string;
}

export const ColorContrastChecker: React.FC<ColorContrastCheckerProps> = ({
  backgroundColor,
  textColor,
  children,
  className,
}) => {
  const [contrastRatio, setContrastRatio] = useState<number>(0);
  const [isAccessible, setIsAccessible] = useState<boolean>(false);

  useEffect(() => {
    // Calculate contrast ratio (simplified)
    const getLuminance = (color: string) => {
      // This is a simplified calculation
      // In a real implementation, you'd use a proper color contrast library
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const bgLuminance = getLuminance(backgroundColor);
    const textLuminance = getLuminance(textColor);
    
    const ratio = (Math.max(bgLuminance, textLuminance) + 0.05) / 
                  (Math.min(bgLuminance, textLuminance) + 0.05);
    
    setContrastRatio(ratio);
    setIsAccessible(ratio >= 4.5); // WCAG AA standard
  }, [backgroundColor, textColor]);

  return (
    <div
      className={cn(
        className,
        !isAccessible && 'border-2 border-red-500'
      )}
      style={{
        backgroundColor,
        color: textColor,
      }}
      title={`Contrast ratio: ${contrastRatio.toFixed(2)} (${isAccessible ? 'Accessible' : 'Not accessible'})`}
    >
      {children}
    </div>
  );
};

export default {
  AccessibilityEnhancer,
  FocusTrap,
  SkipLink,
  ScreenReaderOnly,
  VisuallyHidden,
  AriaLiveRegion,
  KeyboardNavigation,
  ColorContrastChecker,
};
