import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { defaultAppSettings, defaultUserProfile, restaurantsSeed } from '../src/components/data/meshitime-data';
import { useDebouncedValue } from '../src/hooks/use-debounced-value';
import type { AppSettings, Restaurant, RestaurantCategory, UserProfile } from '../types/meshitime';

interface MeshitimeContextValue {
  restaurants: Restaurant[];
  filteredRestaurants: Restaurant[];
  favorites: Restaurant[];
  userProfile: UserProfile;
  appSettings: AppSettings;
  searchText: string;
  selectedFilter: RestaurantCategory;
  isLoading: boolean;
  error: string | null;
  setSearchText: (value: string) => void;
  setSelectedFilter: (filter: RestaurantCategory) => void;
  toggleFavorite: (restaurantId: string) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  updateAppSettings: (updates: Partial<AppSettings>) => void;
  getRestaurantById: (restaurantId: string) => Restaurant | undefined;
  refreshRestaurants: () => Promise<void>;
}

const MeshitimeContext = createContext<MeshitimeContextValue | null>(null);

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function MeshitimeProvider({ children }: { children: React.ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(restaurantsSeed);
  const [profileState, setProfileState] = useState<UserProfile>(defaultUserProfile);
  const [appSettings, setAppSettings] = useState<AppSettings>(defaultAppSettings);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<RestaurantCategory>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearchText = useDebouncedValue(searchText, 280);

  const refreshRestaurants = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await wait(700);
      setRestaurants((current) => [...current]);
    } catch (refreshError) {
      setError(
        refreshError instanceof Error ? refreshError.message : 'データを更新できませんでした。',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleFavorite = useCallback((restaurantId: string) => {
    setRestaurants((current) =>
      current.map((restaurant) =>
        restaurant.id === restaurantId
          ? { ...restaurant, isFavorite: !restaurant.isFavorite }
          : restaurant,
      ),
    );
  }, []);

  const filteredRestaurants = useMemo(() => {
    const normalized = debouncedSearchText.trim().toLowerCase();

    return restaurants.filter((restaurant) => {
      const byFilter =
        selectedFilter === 'all' || restaurant.categories.includes(selectedFilter);
      const bySearch =
        normalized.length === 0 ||
        restaurant.name.toLowerCase().includes(normalized) ||
        restaurant.romajiName.toLowerCase().includes(normalized);

      return byFilter && bySearch;
    });
  }, [debouncedSearchText, restaurants, selectedFilter]);

  const favorites = useMemo(
    () => restaurants.filter((restaurant) => restaurant.isFavorite),
    [restaurants],
  );

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfileState((current) => ({
      ...current,
      ...updates,
      stats: current.stats,
    }));
  }, []);

  const updateAppSettings = useCallback((updates: Partial<AppSettings>) => {
    setAppSettings((current) => ({
      ...current,
      ...updates,
    }));
  }, []);

  const userProfile = useMemo<UserProfile>(
    () => ({
      ...profileState,
      stats: {
        ...profileState.stats,
        favorites: favorites.length,
      },
    }),
    [favorites.length, profileState],
  );

  const getRestaurantById = useCallback(
    (restaurantId: string) => restaurants.find((restaurant) => restaurant.id === restaurantId),
    [restaurants],
  );

  const value = useMemo<MeshitimeContextValue>(
    () => ({
      restaurants,
      filteredRestaurants,
      favorites,
      userProfile,
      appSettings,
      searchText,
      selectedFilter,
      isLoading,
      error,
      setSearchText,
      setSelectedFilter,
      toggleFavorite,
      updateUserProfile,
      updateAppSettings,
      getRestaurantById,
      refreshRestaurants,
    }),
    [
      appSettings,
      error,
      favorites,
      filteredRestaurants,
      getRestaurantById,
      isLoading,
      refreshRestaurants,
      restaurants,
      searchText,
      selectedFilter,
      toggleFavorite,
      updateAppSettings,
      updateUserProfile,
      userProfile,
    ],
  );

  return <MeshitimeContext.Provider value={value}>{children}</MeshitimeContext.Provider>;
}

export function useMeshitime() {
  const context = useContext(MeshitimeContext);
  if (!context) {
    throw new Error('useMeshitime must be used inside MeshitimeProvider');
  }

  return context;
}
