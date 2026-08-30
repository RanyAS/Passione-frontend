import { supabase } from "@/lib/supabase";
import type { Favorite, FavWithStore } from "@/types/Favorite";

type CreateFav = Omit<Favorite, "id" | "created_at">;

export async function getAllFavStore(
  user_id: string
): Promise<FavWithStore[]> {
  const { data, error } = await supabase
    .from("fav")
    .select("*, stores(*)")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as Array<Favorite & { stores: FavWithStore["store"] }>).map(
    (row) => ({
      id: row.id,
      user_id: row.user_id,
      store_id: row.store_id,
      created_at: row.created_at,
      store: row.stores,
    })
  );
}

export async function addFavStore(fav_data: CreateFav): Promise<Favorite> {
  const { data, error } = await supabase
    .from("fav")
    .insert(fav_data)
    .select()
    .single();

  if (error) throw error;
  return data as Favorite;
}

export async function deleteFavStore(
  user_id: string,
  store_id: string
): Promise<null> {
  const { error } = await supabase
    .from("fav")
    .delete()
    .eq("user_id", user_id)
    .eq("store_id", store_id);

  if (error) throw error;
  return null;
}
