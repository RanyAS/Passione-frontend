import axios from "axios";

/** Base URL Express optionnelle (genres / fav / history…). Pins & réservations passent par Supabase. */
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

export default api;
