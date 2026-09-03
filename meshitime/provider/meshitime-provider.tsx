import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getActiveStorePins } from '../src/api/StorePinApi';
import {
  defaultAppSettings,
  emptyUserProfile,
} from '../src/components/data/meshitime-data';
import { useDebouncedValue } from '../src/hooks/use-debounced-value';
import { storePinToRestaurant } from '../src/utils/storePinToRestaurant';
import type {
  AppSettings,
  Restaurant,
  RestaurantCategory,
  UserProfile,
} from '../types/meshitime';
import type { FavWithStore } from '@/types/Favorite';
import { getUser } from '@/api/userApi';
import { resolveSessionUserId } from '@/lib/sessionUser';
import { supabase } from '@/lib/supabase';
import { getAllFavStore } from '@/api/favoriteApi';

interface MeshitimeContextValue {
  restaurants: Restaurant[];
  filteredRestaurants: Restaurant[];
  favorites: FavWithStore[];
  loadFavorites: () => Promise<void>;
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

export function MeshitimeProvider({ children }: { children: React.ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [favorites, setFavorites] = useState<FavWithStore[]>([]);
  const [profileState, setProfileState] = useState<UserProfile>(emptyUserProfile);
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
      const { data: { session } } = await supabase.auth.getSession();
      const storeId = session?.user.id;

      if (storeId) {
         const pins = await getActiveStorePins(storeId);
         setRestaurants(pins.map(storePinToRestaurant));
      }

    } catch (refreshError) {
      setRestaurants([]);
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : 'データを更新できませんでした。',
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
    (restaurantId: string) =>
      restaurants.find((restaurant) => restaurant.id === restaurantId),
    [restaurants],
  );

  const loadUserProfile = useCallback(async () => {
    try {
      const userId = await resolveSessionUserId();
      const user = await getUser(userId);

      setProfileState((current) => ({
        ...current,
        name: user.username,
        username: user.username,
        email: user.email,
        city: user.address,
        imagePath: user.image_path ?? "",
        initials:
          user.username?.slice(0, 2).toUpperCase() || "G",
      }));
    } catch (error) {
      console.error("Failed to load user profile:", error);
    }
  }, []);

const loadFavorites = useCallback(async () => {
  try {
    const userId = await resolveSessionUserId();
    const favoriteRows = await getAllFavStore(userId);

    setFavorites(favoriteRows);
  } catch (error) {
    console.error("Failed to load favorites:", error);
    setFavorites([]);
  }
}, []);

useEffect(() => {
  void refreshRestaurants();

  const loadInitialSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      const accountType = session.user.user_metadata?.account_type;

      if (accountType === "individual") {
        await loadUserProfile();
        await loadFavorites();
      } else {
        setProfileState(emptyUserProfile);
      }
    } else {
      setProfileState(emptyUserProfile);
    }
  };

  void loadInitialSession();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session) {
      const accountType = session.user.user_metadata?.account_type;

      if (accountType === "individual") {
        void loadUserProfile();
        loadFavorites();
      } else {
        setProfileState(emptyUserProfile);
      }
    }

    if (event === "SIGNED_OUT") {
      setProfileState(emptyUserProfile);
    }
  });

  return () => {
    subscription.unsubscribe();
  };
}, [refreshRestaurants, loadUserProfile, loadFavorites]);

  const value = useMemo<MeshitimeContextValue>(
    () => ({
      restaurants,
      filteredRestaurants,
      favorites,
      loadFavorites,
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
      loadFavorites,
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
