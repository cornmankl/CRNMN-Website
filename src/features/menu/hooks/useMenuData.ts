import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMenuStore } from '../store/menuStore';
import { menuService } from '../services/menuService';

export const useMenuData = () => {
  const { setItems, setLoading, setError } = useMenuStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['menu-items'],
    queryFn: () => menuService.getMenuItems(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (error) {
      setError((error as Error).message);
    } else {
      setError(null);
    }
  }, [error, setError]);

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data, setItems]);

  return {
    items: data || [],
    isLoading,
    error: error as Error | null,
  };
};
