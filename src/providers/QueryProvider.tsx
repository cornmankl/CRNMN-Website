import React from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a client with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 404 or 401 errors
        if (error?.status === 404 || error?.status === 401) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry on 404 or 401 errors
        if (error?.status === 404 || error?.status === 401) return false;
        return failureCount < 3;
      },
    },
  },
  logger: {
    log: console.log,
    warn: console.warn,
    error: (error) => {
      // Don't log React Query errors to console to avoid noise
      console.warn('React Query error:', error);
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

// Custom hooks for common API calls
export const useApiQuery = (key: string[], queryFn: () => Promise<any>, options?: any) => {
  return useQuery({
    queryKey: key,
    queryFn,
    ...options,
  });
};

export const useApiMutation = (mutationFn: (variables: any) => Promise<any>, options?: any) => {
  return useMutation({
    mutationFn,
    ...options,
  });
};

// Prefetching utility
export const prefetchQuery = async (key: string[], queryFn: () => Promise<any>) => {
  await queryClient.prefetchQuery({
    queryKey: key,
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Cache utilities
export const invalidateQueries = (key: string[]) => {
  queryClient.invalidateQueries({ queryKey: key });
};

export const removeQueries = (key: string[]) => {
  queryClient.removeQueries({ queryKey: key });
};

export const setQueryData = (key: string[], data: any) => {
  queryClient.setQueryData(key, data);
};

export const getQueryData = (key: string[]) => {
  return queryClient.getQueryData(key);
};
