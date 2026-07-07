import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://yarcsujzlvzbolgkolpd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_9_FCh4lqkwOJ7aE4nIsgkQ_T3dP0-YZ";

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) =>
    SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

const WebStorageAdapter = {
  getItem: (key: string) => {
    if (typeof window === "undefined") {
      return Promise.resolve(null);
    }

    return Promise.resolve(window.localStorage.getItem(key));
  },

  setItem: (key: string, value: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    }

    return Promise.resolve();
  },

  removeItem: (key: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }

    return Promise.resolve();
  },
};

const storage =
  Platform.OS === "web" ? WebStorageAdapter : ExpoSecureStoreAdapter;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});