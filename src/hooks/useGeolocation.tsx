import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
}

interface DeliveryEstimate {
  distance: number;
  delivery_time: number;
  delivery_fee: number;
  in_range: boolean;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: false,
  });

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
        loading: false,
      }));
      return;
    }

    setLocation(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          loading: false,
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }

        setLocation(prev => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000, // 10 minutes
      }
    );
  };

  const getDeliveryEstimate = async (lat?: number, lng?: number): Promise<DeliveryEstimate | null> => {
    const latitude = lat || location.latitude;
    const longitude = lng || location.longitude;

    if (!latitude || !longitude) {
      throw new Error('Location not available');
    }

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-81d654e2/delivery-estimate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ lat: latitude, lng: longitude })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to get delivery estimate');
      }

      return result;
    } catch (error) {
      console.log('Delivery estimate error:', error);
      throw error;
    }
  };

  // Automatically get location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    ...location,
    getCurrentLocation,
    getDeliveryEstimate,
  };
};