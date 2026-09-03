import type { AppSettings, RestaurantCategory, UserProfile } from '../../../types/meshitime';

/** Centre carte par défaut (Osaka) si la géoloc n’est pas dispo. */
export const DEFAULT_MAP_CENTER = {
  latitude: 34.7074,
  longitude: 135.5034,
} as const;

export const onboardingSlides = [
  {
    emoji: '🍜',
    title: '空席をお得に活用',
    description: 'レストランの空席時間を見つけて、特別価格で食事を楽しもう',
    colors: ['#FFEDD5', '#FFF7ED'] as [string, string],
  },
  {
    emoji: '📍',
    title: 'リアルタイムオファーを受け取る',
    description: 'あなたの近くの最新のお得情報をリアルタイムで確認',
    colors: ['#DBEAFE', '#EFF6FF'] as [string, string],
  },
  {
    emoji: '🎉',
    title: '今すぐ始めよう',
    description: 'めしタイムで、毎日の食事をもっと楽しく、もっとお得に',
    colors: ['#FCE7F3', '#FDF2F8'] as [string, string],
  },
] as const;

export const homeFilters: { icon: string; label: string; value: RestaurantCategory }[] = [
  { icon: '🍜', label: 'すべて', value: 'all' },
  { icon: '⭐', label: '人気', value: 'popular' },
  { icon: '📍', label: '近く', value: 'nearby' },
  { icon: '🍣', label: '和食', value: 'japanese' },
  { icon: '🍕', label: '洋食', value: 'western' },
];

export const emptyUserProfile: UserProfile = {
  name: '',
  initials: '',
  username: '',
  email: '',
  phone: '',
  age: 0,
  city: '',
  avatarEmoji: '🍜',
  imagePath: "",
  locationPermission: 'denied',
  stats: {
    visits: 0,
    favorites: 0,
    reviews: 0,
  },
  history: [],
};

export const defaultAppSettings: AppSettings = {
  notificationsEnabled: true,
  remindersEnabled: true,
  locationPermission: 'denied',
  language: 'ja',
  theme: 'light',
  distanceRadiusKm: 3,
  cuisinePreferences: ['all'],
};
