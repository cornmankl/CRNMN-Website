import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Phone,
  Star,
  Directions,
  Search,
  Loader2
} from 'lucide-react';

interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone: string;
  hours: string;
  rating: number;
  deliveryRadius: number;
  estimatedDeliveryTime: string;
}

interface GoogleMapsIntegrationProps {
  onLocationSelect?: (location: Location) => void;
  showDeliveryInfo?: boolean;
}

export const GoogleMapsIntegration: React.FC<GoogleMapsIntegrationProps> = ({
  onLocationSelect,
  showDeliveryInfo = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // CRNMN Locations
  const crnmnLocations: Location[] = [
    {
      id: '1',
      name: 'CRNMN KLCC',
      address: 'Suria KLCC, Kuala Lumpur City Centre, 50088 Kuala Lumpur',
      coordinates: { lat: 3.1579, lng: 101.7116 },
      phone: '+60 3-2181 8888',
      hours: '10:00 AM - 10:00 PM',
      rating: 4.8,
      deliveryRadius: 5,
      estimatedDeliveryTime: '15-20 minutes'
    },
    {
      id: '2',
      name: 'CRNMN Bukit Bintang',
      address: 'Pavilion Kuala Lumpur, 168 Jalan Bukit Bintang, 55100 Kuala Lumpur',
      coordinates: { lat: 3.1490, lng: 101.7120 },
      phone: '+60 3-2118 8833',
      hours: '10:00 AM - 10:00 PM',
      rating: 4.7,
      deliveryRadius: 4,
      estimatedDeliveryTime: '12-18 minutes'
    },
    {
      id: '3',
      name: 'CRNMN Mont Kiara',
      address: 'Solaris Mont Kiara, 50480 Kuala Lumpur',
      coordinates: { lat: 3.1700, lng: 101.6500 },
      phone: '+60 3-6201 8888',
      hours: '10:00 AM - 10:00 PM',
      rating: 4.9,
      deliveryRadius: 6,
      estimatedDeliveryTime: '18-25 minutes'
    },
    {
      id: '4',
      name: 'CRNMN Petaling Jaya',
      address: '1 Utama Shopping Centre, 47800 Petaling Jaya, Selangor',
      coordinates: { lat: 3.1497, lng: 101.6169 },
      phone: '+60 3-7725 8888',
      hours: '10:00 AM - 10:00 PM',
      rating: 4.6,
      deliveryRadius: 5,
      estimatedDeliveryTime: '20-30 minutes'
    }
  ];

  useEffect(() => {
    if (mapRef.current && !map) {
      initializeMap();
    }
  }, [mapRef.current]);

  useEffect(() => {
    if (map) {
      addLocationMarkers();
    }
  }, [map]);

  const initializeMap = () => {
    if (!mapRef.current) return;

    const defaultLocation = { lat: 3.1579, lng: 101.7116 }; // KLCC as default

    const mapInstance = new google.maps.Map(mapRef.current, {
      zoom: 12,
      center: defaultLocation,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    setMap(mapInstance);

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          
          // Add user location marker
          new google.maps.Marker({
            position: userPos,
            map: mapInstance,
            title: 'Your Location',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#00ff88" stroke="#000" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" fill="#000"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(24, 24)
            }
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  };

  const addLocationMarkers = () => {
    if (!map) return;

    crnmnLocations.forEach((location) => {
      const marker = new google.maps.Marker({
        position: location.coordinates,
        map: map,
        title: location.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#ff6b35" stroke="#000" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-size="16" font-weight="bold">🌽</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32)
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: #ff6b35; font-size: 16px;">${location.name}</h3>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">${location.address}</p>
            <div style="display: flex; align-items: center; margin: 4px 0;">
              <span style="color: #ffd700;">★</span>
              <span style="margin-left: 4px; font-size: 14px;">${location.rating}</span>
            </div>
            <div style="margin: 4px 0; font-size: 14px; color: #666;">
              📞 ${location.phone}
            </div>
            <div style="margin: 4px 0; font-size: 14px; color: #666;">
              🕒 ${location.hours}
            </div>
            <div style="margin: 4px 0; font-size: 14px; color: #00ff88; font-weight: bold;">
              🚚 ${location.estimatedDeliveryTime}
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        setSelectedLocation(location);
        onLocationSelect?.(location);
      });
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !map) return;

    setIsLoading(true);

    try {
      const geocoder = new google.maps.Geocoder();
      const results = await geocoder.geocode({ address: searchQuery });

      if (results.results.length > 0) {
        const location = results.results[0].geometry.location;
        map.setCenter(location);
        map.setZoom(15);

        // Add search result marker
        new google.maps.Marker({
          position: location,
          map: map,
          title: 'Search Result',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" fill="#3b82f6" stroke="#000" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" fill="#000"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(24, 24)
          }
        });
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDirections = (location: Location) => {
    if (!userLocation) {
      alert('Please enable location access to get directions');
      return;
    }

    const directionsUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${location.coordinates.lat},${location.coordinates.lng}`;
    window.open(directionsUrl, '_blank');
  };

  const calculateDistance = (location: Location) => {
    if (!userLocation) return null;

    const R = 6371; // Earth's radius in kilometers
    const dLat = (location.coordinates.lat - userLocation.lat) * Math.PI / 180;
    const dLng = (location.coordinates.lng - userLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(location.coordinates.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return distance.toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="bg-[var(--neutral-800)]">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--neutral-400)]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for your location..."
                className="pl-10 bg-[var(--neutral-700)] border-[var(--neutral-600)]"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              className="btn-primary"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Map Container */}
      <Card className="bg-[var(--neutral-800)]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            CRNMN Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={mapRef} 
            className="w-full h-96 rounded-lg border border-[var(--neutral-700)]"
            style={{ minHeight: '400px' }}
          />
        </CardContent>
      </Card>

      {/* Location List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {crnmnLocations.map((location) => {
          const distance = calculateDistance(location);
          const isInDeliveryRange = distance ? parseFloat(distance) <= location.deliveryRadius : false;

          return (
            <Card 
              key={location.id} 
              className={`bg-[var(--neutral-800)] border-[var(--neutral-700)] hover:border-[var(--neon-green)] transition-colors cursor-pointer ${
                selectedLocation?.id === location.id ? 'border-[var(--neon-green)]' : ''
              }`}
              onClick={() => {
                setSelectedLocation(location);
                onLocationSelect?.(location);
                if (map) {
                  map.setCenter(location.coordinates);
                  map.setZoom(16);
                }
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white mb-1">{location.name}</h3>
                    <p className="text-sm text-[var(--neutral-400)] mb-2">{location.address}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold text-white">{location.rating}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-[var(--neutral-300)]">
                    <Phone className="w-4 h-4" />
                    <span>{location.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--neutral-300)]">
                    <Clock className="w-4 h-4" />
                    <span>{location.hours}</span>
                  </div>
                  {distance && (
                    <div className="flex items-center gap-2 text-sm text-[var(--neutral-300)]">
                      <Navigation className="w-4 h-4" />
                      <span>{distance} km away</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={isInDeliveryRange ? "default" : "secondary"}
                      className={isInDeliveryRange ? "neon-bg text-black" : ""}
                    >
                      {isInDeliveryRange ? "Delivery Available" : "Out of Range"}
                    </Badge>
                    <span className="text-sm text-[var(--neon-green)] font-semibold">
                      {location.estimatedDeliveryTime}
                    </span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      getDirections(location);
                    }}
                    className="border-[var(--neutral-600)] hover:bg-[var(--neutral-700)]"
                  >
                    <Directions className="w-4 h-4 mr-1" />
                    Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Delivery Information */}
      {showDeliveryInfo && (
        <Card className="bg-gradient-to-r from-[var(--neon-green)]/10 to-transparent border-[var(--neon-green)]/20">
          <CardContent className="p-4">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[var(--neon-green)]" />
              Delivery Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-[var(--neon-green)] font-semibold">Delivery Fee:</span>
                <span className="text-white ml-2">RM 2.50</span>
              </div>
              <div>
                <span className="text-[var(--neon-green)] font-semibold">Free Delivery:</span>
                <span className="text-white ml-2">Orders above RM 25</span>
              </div>
              <div>
                <span className="text-[var(--neon-green)] font-semibold">Average Time:</span>
                <span className="text-white ml-2">15-20 minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};