import { supabase } from "@/lib/supabase";
import type {
  CreateStorePayload,
  Store,
  UpdateStorePayload,
} from "@/types/Store";

export async function getStoreById(store_id: string): Promise<Store> {
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("id", store_id)
    .single();

  if (error) throw error;
  return data as Store;
}

export async function getStores(genre_id?: string): Promise<Store[]> {
  let query = supabase.from("stores").select("*").order("created_at", {
    ascending: false,
  });

  if (genre_id) query = query.eq("genre_id", genre_id);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Store[];
}

export async function createStore(payload: CreateStorePayload): Promise<Store> {
  const insertPayload: Record<string, unknown> = {
    sname: payload.sname,
    email: payload.email,
    password: payload.password,
    address: payload.address,
    tel: payload.tel ?? "",
    open_time: payload.open_time ?? "",
    site: payload.site ?? "",
    image_path: payload.image_path ?? "",
    genre_id: payload.genre_id ?? null,
    latitude: payload.latitude ?? null,
    longitude: payload.longitude ?? null,
    star: payload.star ?? 0,
  };
  if (payload.id) insertPayload.id = payload.id;

  const { data, error } = await supabase
    .from("stores")
    .insert(insertPayload)
    .select()
    .single();

  if (error) throw error;
  return data as Store;
}

export async function updateStore(
  store_id: string,
  store_data: UpdateStorePayload
): Promise<Store> {
  const allowed = [
    "sname",
    "email",
    "password",
    "address",
    "tel",
    "open_time",
    "site",
    "image_path",
    "latitude",
    "longitude",
    "genre_id",
    "star",
  ] as const;

  const payload: Record<string, unknown> = {};
  for (const key of allowed) {
    if (store_data[key] !== undefined) payload[key] = store_data[key];
  }

  if (Object.keys(payload).length === 0) {
    throw new Error("No fields to update");
  }

  const { data, error } = await supabase
    .from("stores")
    .update(payload)
    .eq("id", store_id)
    .select()
    .single();

  if (error) throw error;
  return data as Store;
}

export async function deleteStore(store_id: string): Promise<null> {
  const { error } = await supabase.from("stores").delete().eq("id", store_id);
  if (error) throw error;
  return null;
}
