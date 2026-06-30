import { useCallback, useState } from 'react';

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type LocationCoords = {
  latitude: number;
  longitude: number;
};

type LocationResult = {
  coords: LocationCoords;
};

interface UseLocationOptions extends Region {}

export function useLocation(initialRegion: UseLocationOptions) {
  const [region, setRegion] = useState<Region>(initialRegion);

  // Simplified fallback that returns current region.
  // Plug a real geolocation API here if needed (expo-location or native module).
  const getCurrentLocation = useCallback(async (): Promise<LocationResult | null> => {
    return { coords: { latitude: region.latitude, longitude: region.longitude } };
  }, [region.latitude, region.longitude]);

  return {
    region,
    setRegion,
    getCurrentLocation,
  };
}
