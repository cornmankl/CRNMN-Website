import React from 'react';
import { cn } from '../components/ui/utils';

// Base skeleton component
interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  radius?: string;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width = '100%',
  height = '1rem',
  radius = '0.25rem',
  animate = true,
}) => {
  return React.createElement('div', {
    className: cn(
      'bg-gray-200',
      animate && 'animate-pulse',
      className
    ),
    style: {
      width,
      height,
      borderRadius: radius,
    },
  });
};

// Text skeleton component
interface TextSkeletonProps {
  lines?: number;
  className?: string;
  lastLineWidth?: string;
}

export const TextSkeleton: React.FC<TextSkeletonProps> = ({
  lines = 3,
  className,
  lastLineWidth = '60%',
}) => {
  return React.createElement(
    'div',
    { className: cn('space-y-2', className) },
    ...Array.from({ length: lines - 1 }, (_, i) =>
      React.createElement(Skeleton, {
        key: i,
        height: '1rem',
      })
    ),
    React.createElement(Skeleton, {
      key: lines - 1,
      height: '1rem',
      width: lastLineWidth,
    })
  );
};

// Card skeleton component
interface CardSkeletonProps {
  className?: string;
  showAvatar?: boolean;
  showImage?: boolean;
  lines?: number;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  className,
  showAvatar = true,
  showImage = false,
  lines = 3,
}) => {
  return React.createElement(
    'div',
    { className: cn('p-4 border rounded-lg space-y-3', className) },
    showImage && React.createElement(Skeleton, {
      height: '200px',
      className: 'w-full',
    }),
    React.createElement(
      'div',
      { className: 'flex items-start space-x-3' },
      showAvatar && React.createElement(Skeleton, {
        width: '40px',
        height: '40px',
        radius: '50%',
      }),
      React.createElement('div', { className: 'flex-1 space-y-2' },
        React.createElement(Skeleton, { height: '1.25rem', width: '70%' }),
        React.createElement(Skeleton, { height: '1rem', width: '90%' })
      )
    ),
    React.createElement(TextSkeleton, { lines })
  );
};

// List skeleton component
interface ListSkeletonProps {
  items?: number;
  className?: string;
  showAvatar?: boolean;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({
  items = 5,
  className,
  showAvatar = true,
}) => {
  return React.createElement(
    'div',
    { className: cn('space-y-3', className) },
    ...Array.from({ length: items }, (_, i) =>
      React.createElement(
        'div',
        { key: i, className: 'flex items-center space-x-3 p-3 border rounded' },
        showAvatar && React.createElement(Skeleton, {
          width: '40px',
          height: '40px',
          radius: '50%',
        }),
        React.createElement('div', { className: 'flex-1 space-y-2' },
          React.createElement(Skeleton, { height: '1rem', width: '80%' }),
          React.createElement(Skeleton, { height: '0.75rem', width: '60%' })
        )
      )
    )
  );
};

// Table skeleton component
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className,
}) => {
  return React.createElement(
    'div',
    { className: cn('w-full', className) },
    // Header
    React.createElement(
      'div',
      { className: 'flex border-b font-medium p-2 bg-gray-50' },
      ...Array.from({ length: columns }, (_, i) =>
        React.createElement(Skeleton, {
          key: `header-${i}`,
          height: '1.5rem',
          width: `${100 / columns}%`,
          className: 'mx-1',
        })
      )
    ),
    // Rows
    ...Array.from({ length: rows }, (_, rowIndex) =>
      React.createElement(
        'div',
        { key: rowIndex, className: 'flex border-b p-2' },
        ...Array.from({ length: columns }, (_, colIndex) =>
          React.createElement(Skeleton, {
            key: `${rowIndex}-${colIndex}`,
            height: '2rem',
            width: colIndex === 0 ? '80%' : '60%',
            className: 'mx-1',
          })
        )
      )
    )
  );
};

// Grid skeleton component
interface GridSkeletonProps {
  items?: number;
  columns?: number;
  className?: string;
  aspectRatio?: string;
}

export const GridSkeleton: React.FC<GridSkeletonProps> = ({
  items = 6,
  columns = 3,
  className,
  aspectRatio = '1/1',
}) => {
  return React.createElement(
    'div',
    { 
      className: cn(
        'grid gap-4',
        {
          'grid-cols-1': columns === 1,
          'grid-cols-2': columns === 2,
          'grid-cols-3': columns === 3,
          'grid-cols-4': columns === 4,
        },
        className
      )
    },
    ...Array.from({ length: items }, (_, i) =>
      React.createElement(
        'div',
        { key: i, className: 'space-y-3' },
        React.createElement('div', {
          className: 'relative',
          style: { paddingBottom: `calc(${aspectRatio} * 100%)` },
        },
          React.createElement(Skeleton, {
            className: 'absolute inset-0',
          })
        ),
        React.createElement('div', { className: 'space-y-2' },
          React.createElement(Skeleton, { height: '1rem', width: '80%' }),
          React.createElement(Skeleton, { height: '0.75rem', width: '60%' })
        )
      )
    )
  );
};

// Profile skeleton component
interface ProfileSkeletonProps {
  className?: string;
  showStats?: boolean;
}

export const ProfileSkeleton: React.FC<ProfileSkeletonProps> = ({
  className,
  showStats = true,
}) => {
  return React.createElement(
    'div',
    { className: cn('space-y-6', className) },
    // Header
    React.createElement(
      'div',
      { className: 'flex items-center space-x-4' },
      React.createElement(Skeleton, {
        width: '80px',
        height: '80px',
        radius: '50%',
      }),
      React.createElement('div', { className: 'flex-1 space-y-3' },
        React.createElement(Skeleton, { height: '1.5rem', width: '40%' }),
        React.createElement(Skeleton, { height: '1rem', width: '60%' })
      )
    ),
    // Stats
    showStats && React.createElement(
      'div',
      { className: 'grid grid-cols-3 gap-4' },
      ...Array.from({ length: 3 }, (_, i) =>
        React.createElement(
          'div',
          { key: i, className: 'text-center p-3 border rounded' },
          React.createElement(Skeleton, { height: '1.5rem', width: '50%', className: 'mx-auto mb-2' }),
          React.createElement(Skeleton, { height: '0.75rem', width: '80%', className: 'mx-auto' })
        )
      )
    ),
    // Content
    React.createElement(TextSkeleton, { lines: 4 })
  );
};

// Form skeleton component
interface FormSkeletonProps {
  fields?: number;
  className?: string;
  showButton?: boolean;
}

export const FormSkeleton: React.FC<FormSkeletonProps> = ({
  fields = 4,
  className,
  showButton = true,
}) => {
  return React.createElement(
    'div',
    { className: cn('space-y-4', className) },
    ...Array.from({ length: fields }, (_, i) =>
      React.createElement('div', { key: i, className: 'space-y-2' },
        React.createElement(Skeleton, { height: '1rem', width: '30%' }),
        React.createElement(Skeleton, { height: '2.5rem', width: '100%' })
      )
    ),
    showButton && React.createElement(Skeleton, {
      height: '2.5rem',
      width: '120px',
      className: 'mt-6',
    })
  );
};

// Chart skeleton component
interface ChartSkeletonProps {
  type?: 'line' | 'bar' | 'pie' | 'area';
  className?: string;
  showLegend?: boolean;
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({
  type = 'line',
  className,
  showLegend = true,
}) => {
  return React.createElement(
    'div',
    { className: cn('space-y-4', className) },
    // Chart area
    React.createElement('div', {
      className: 'relative',
      style: { paddingBottom: '60%' },
    },
      React.createElement(Skeleton, {
        className: 'absolute inset-0',
      })
    ),
    // Legend
    showLegend && React.createElement(
      'div',
      { className: 'flex justify-center space-x-4' },
      ...Array.from({ length: 4 }, (_, i) =>
        React.createElement(
          'div',
          { key: i, className: 'flex items-center space-x-2' },
          React.createElement(Skeleton, {
            width: '12px',
            height: '12px',
            radius: '2px',
          }),
          React.createElement(Skeleton, { height: '0.75rem', width: '60px' })
        )
      )
    )
  );
};

// Product card skeleton component
interface ProductCardSkeletonProps {
  className?: string;
  showRating?: boolean;
  showPrice?: boolean;
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({
  className,
  showRating = true,
  showPrice = true,
}) => {
  return React.createElement(
    'div',
    { className: cn('border rounded-lg overflow-hidden', className) },
    // Image
    React.createElement('div', {
      className: 'relative',
      style: { paddingBottom: '100%' },
    },
      React.createElement(Skeleton, {
        className: 'absolute inset-0',
      })
    ),
    // Content
    React.createElement('div', { className: 'p-4 space-y-3' },
      React.createElement(Skeleton, { height: '1.25rem', width: '90%' }),
      React.createElement(Skeleton, { height: '0.875rem', width: '70%' }),
      showRating && React.createElement(
        'div',
        { className: 'flex items-center space-x-1' },
        ...Array.from({ length: 5 }, (_, i) =>
          React.createElement(Skeleton, {
            key: i,
            width: '16px',
            height: '16px',
            radius: '2px',
          })
        )
      ),
      showPrice && React.createElement(
        'div',
        { className: 'flex items-center justify-between' },
        React.createElement(Skeleton, { height: '1.5rem', width: '80px' }),
        React.createElement(Skeleton, { height: '2rem', width: '100px', radius: '0.5rem' })
      )
    )
  );
};

// Loading overlay component
interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = 'Loading...',
  className,
}) => {
  if (!isLoading) return null;

  return React.createElement(
    'div',
    {
      className: cn(
        'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
        className
      ),
    },
    React.createElement(
      'div',
      { className: 'bg-white p-6 rounded-lg shadow-xl flex flex-col items-center space-y-4' },
      React.createElement('div', {
        className: 'w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin',
      }),
      React.createElement('div', { className: 'text-gray-700' }, message)
    )
  );
};

// Page skeleton component
interface PageSkeletonProps {
  type?: 'dashboard' | 'profile' | 'list' | 'form' | 'blog' | 'ecommerce';
  className?: string;
}

export const PageSkeleton: React.FC<PageSkeletonProps> = ({
  type = 'dashboard',
  className,
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'dashboard':
        return React.createElement(
          'div',
          { className: 'space-y-6' },
          // Stats cards
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' },
            ...Array.from({ length: 4 }, (_, i) =>
              React.createElement(CardSkeleton, { key: i, showAvatar: false, lines: 2 })
            )
          ),
          // Charts
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 lg:grid-cols-2 gap-4' },
            React.createElement(ChartSkeleton, { type: 'line' }),
            React.createElement(ChartSkeleton, { type: 'bar' })
          ),
          // Recent activity
          React.createElement(ListSkeleton, { items: 5, showAvatar: true })
        );
      
      case 'profile':
        return React.createElement(ProfileSkeleton, { showStats: true });
      
      case 'list':
        return React.createElement(ListSkeleton, { items: 8, showAvatar: true });
      
      case 'form':
        return React.createElement(FormSkeleton, { fields: 6, showButton: true });
      
      case 'blog':
        return React.createElement(
          'div',
          { className: 'space-y-6' },
          ...Array.from({ length: 3 }, (_, i) =>
            React.createElement(CardSkeleton, {
              key: i,
              showImage: true,
              lines: 4,
            })
          )
        );
      
      case 'ecommerce':
        return React.createElement(
          'div',
          { className: 'space-y-6' },
          React.createElement(
            'div',
            { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' },
            ...Array.from({ length: 8 }, (_, i) =>
              React.createElement(ProductCardSkeleton, { key: i })
            )
          )
        );
      
      default:
        return React.createElement(TextSkeleton, { lines: 10 });
    }
  };

  return React.createElement(
    'div',
    { className: cn('p-6', className) },
    renderSkeleton()
  );
};

// Skeleton provider for managing loading states
interface SkeletonContextProps {
  isLoading: boolean;
  skeletonType?: 'dashboard' | 'profile' | 'list' | 'form' | 'blog' | 'ecommerce';
  children: React.ReactNode;
}

export const SkeletonProvider: React.FC<SkeletonContextProps> = ({
  isLoading,
  skeletonType = 'dashboard',
  children,
}) => {
  if (isLoading) {
    return React.createElement(PageSkeleton, { type: skeletonType });
  }

  return React.createElement(React.Fragment, null, children);
};

// Higher-order component for skeleton loading
export function withSkeletonLoading<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    skeletonType?: 'dashboard' | 'profile' | 'list' | 'form' | 'blog' | 'ecommerce';
    loadingCondition?: (props: P) => boolean;
  } = {}
) {
  const {
    skeletonType = 'dashboard',
    loadingCondition = () => true,
  } = options;

  const WithSkeleton: React.FC<P> = (props) => {
    const isLoading = loadingCondition(props);

    if (isLoading) {
      return React.createElement(PageSkeleton, { type: skeletonType });
    }

    return React.createElement(Component, props);
  };

  WithSkeleton.displayName = `WithSkeletonLoading(${Component.displayName || Component.name})`;

  return WithSkeleton;
}

export default {
  Skeleton,
  TextSkeleton,
  CardSkeleton,
  ListSkeleton,
  TableSkeleton,
  GridSkeleton,
  ProfileSkeleton,
  FormSkeleton,
  ChartSkeleton,
  ProductCardSkeleton,
  LoadingOverlay,
  PageSkeleton,
  SkeletonProvider,
  withSkeletonLoading,
};
