import { Favorite, FavWithStore } from "@/types/Favorite";
import api from "./api";

type CreateFav = Omit<Favorite, "id" | "created_at">;

export async function getAllFavStore(user_id: string): Promise<FavWithStore[]> {
  try {
    const { data } = await api.get<FavWithStore[]>(
      `/api/fav/${user_id}`
    );

    return data;
  } catch (error: any) {
    console.log("❌ GET FAVORITES ERROR");
    console.log("status:", error.response?.status);
    console.log("data:", error.response?.data);
    console.log("url:", error.config?.url);

    throw error;
  }
}

export async function checkFavStore(
    user_id: string,
    store_id: string
): Promise<boolean> {
    const { data } = await api.get<{ isFavorite: boolean }>(
        `/api/fav/${user_id}/${store_id}/check`
    );

    return data.isFavorite;
}

export async function addFavStore(fav_data:CreateFav): Promise<Favorite> {
    const { data } = await api.post<Favorite>("/api/fav", fav_data);
    return data;
}

export async function deleteFavStore(user_id:string, store_id:string): Promise<Favorite | null> {
    const { data } = await api.delete<Favorite | null>(`/api/fav/${user_id}/${store_id}`);
    return data;
}