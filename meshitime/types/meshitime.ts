export type RestaurantCategory = 'all' | 'nearby' | 'japanese' | 'western' | 'popular';
export type LocationPermission = 'allowed' | 'manual' | 'denied';
export type AppLanguage = 'ja' | 'en';
export type ThemeMode = 'light' | 'dark';

export interface AppSettings {
  notificationsEnabled: boolean;
  remindersEnabled: boolean;
  locationPermission: LocationPermission;
  language: AppLanguage;
  theme: ThemeMode;
  distanceRadiusKm: number;
  cuisinePreferences: RestaurantCategory[];
}

export interface Deal {
  discountLabel: string;
  originalPrice: number;
  dealPrice: number;
  availableSeats: number;
  deadlineLabel: string;
  campaign: string;
}

export interface MenuItem {
  id: string;
  emoji: string;
  name: string;
  gradient: [string, string];
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  timeLabel: string;
}

export interface HistoryItem {
  id: string;
  dateLabel: string;
  restaurantName: string;
  emoji: string;
  discountLabel: string;
  amountLabel: string;
  gradient: [string, string];
}

export interface Restaurant {
  id: string;
  name: string;
  romajiName: string;
  emoji: string;
  rating: number;
  reviewsCount: number;
  address: string;
  openingHours: string;
  phone: string;
  gradient: [string, string];
  categories: RestaurantCategory[];
  deal: Deal;
  menuItems: MenuItem[];
  reviews: Review[];
  isFavorite: boolean;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  pinPosition: {
    top: `${number}%`;
    left: `${number}%`;
    active: boolean;
  };
}

export interface UserProfile {
  name: string;
  initials: string;
  username: string;
  email: string;
  phone: string;
  age: number;
  city: string;
  avatarEmoji: string;
  locationPermission: LocationPermission;
  stats: {
    visits: number;
    favorites: number;
    reviews: number;
  };
  history: HistoryItem[];
}

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}
