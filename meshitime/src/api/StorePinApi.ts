import { supabase } from "@/lib/supabase";
import type {
  CreateStorePinPayload,
  StorePin,
  UpdateStorePinPayload,
} from "@/types/StorePin";

const STORE_PIN_SELECT = `
  id,
  store_id,
  time,
  empty_seat,
  rule,
  description,
  created_at,
  starts_at,
  ends_at,
  is_active,
  stores!inner (
    id,
    sname,
    address,
    tel,
    open_time,
    star,
    site,
    image_path,
    genre_id,
    latitude,
    longitude,
    created_at
  )
`;

type StorePinRow = {
  id: string;
  store_id: string;
  time: string | null;
  empty_seat: number;
  rule: string | null;
  description: string | null;
  created_at: string;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  stores:
    | {
        id: string;
        sname: string;
        address: string;
        tel: string | null;
        open_time: string | null;
        star: number | null;
        site: string | null;
        image_path: string | null;
        genre_id: string | null;
        latitude: number;
        longitude: number;
        created_at: string;
      }
    | Array<{
        id: string;
        sname: string;
        address: string;
        tel: string | null;
        open_time: string | null;
        star: number | null;
        site: string | null;
        image_path: string | null;
        genre_id: string | null;
        latitude: number;
        longitude: number;
        created_at: string;
      }>;
};

function mapStorePinRow(row: StorePinRow): StorePin {
  const store = Array.isArray(row.stores) ? row.stores[0] : row.stores;

  return {
    id: row.id,
    storeId: row.store_id,
    time: row.time,
    emptySeat: row.empty_seat,
    rule: row.rule,
    description: row.description,
    createdAt: row.created_at,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    isActive: row.is_active,
    store: {
      id: store.id,
      name: store.sname,
      address: store.address,
      tel: store.tel,
      openTime: store.open_time,
      star: store.star,
      site: store.site,
      imagePath: store.image_path,
      genreId: store.genre_id,
      latitude: Number(store.latitude),
      longitude: Number(store.longitude),
      createdAt: store.created_at,
    },
    coordinates: {
      latitude: Number(store.latitude),
      longitude: Number(store.longitude),
    },
  };
}

function buildUpdatePayload(patch: UpdateStorePinPayload) {
  const payload: Record<string, unknown> = {};
  if (patch.storeId !== undefined) payload.store_id = patch.storeId;
  if (patch.time !== undefined) payload.time = patch.time;
  if (patch.emptySeat !== undefined) payload.empty_seat = patch.emptySeat;
  if (patch.rule !== undefined) payload.rule = patch.rule;
  if (patch.description !== undefined) payload.description = patch.description;
  if (patch.startsAt !== undefined) payload.starts_at = patch.startsAt;
  if (patch.endsAt !== undefined) payload.ends_at = patch.endsAt;
  if (patch.isActive !== undefined) payload.is_active = patch.isActive;
  return payload;
}

export async function getStorePins(store_id?: string | null): Promise<StorePin[]> {
  let query = supabase
    .from("store_pin")
    .select(STORE_PIN_SELECT)
    .not("stores.latitude", "is", null)
    .not("stores.longitude", "is", null)
    .order("created_at", { ascending: false });

  if (store_id) query = query.eq("store_id", store_id);

  const { data, error } = await query;
  if (error) throw error;
  return ((data ?? []) as StorePinRow[]).map(mapStorePinRow);
}

export async function getActiveStorePins(
  store_id?: string | null
): Promise<StorePin[]> {
  const nowIso = new Date().toISOString();
  const allPins = await getStorePins(store_id);

  return allPins.filter((pin) => {
    const afterStart = !pin.startsAt || pin.startsAt <= nowIso;
    const beforeEnd = !pin.endsAt || pin.endsAt >= nowIso;
    return pin.isActive && afterStart && beforeEnd;
  });
}

export async function getStorePin(pin_id: string): Promise<StorePin> {
  const { data, error } = await supabase
    .from("store_pin")
    .select(STORE_PIN_SELECT)
    .eq("id", pin_id)
    .single();

  if (error) throw error;
  return mapStorePinRow(data as StorePinRow);
}

export async function createStorePin(
  payload: CreateStorePinPayload
): Promise<StorePin> {
  const insertPayload = {
    store_id: payload.storeId,
    time: payload.time ?? null,
    empty_seat: payload.emptySeat,
    rule: payload.rule ?? null,
    description: payload.description ?? null,
    starts_at: payload.startsAt ?? null,
    ends_at: payload.endsAt ?? null,
    is_active: payload.isActive ?? true,
  };

  const { data, error } = await supabase
    .from("store_pin")
    .insert(insertPayload)
    .select(STORE_PIN_SELECT)
    .single();

  if (error) throw error;
  return mapStorePinRow(data as StorePinRow);
}

export async function updateStorePin(
  pin_id: string,
  patch: UpdateStorePinPayload
): Promise<StorePin> {
  const { data, error } = await supabase
    .from("store_pin")
    .update(buildUpdatePayload(patch))
    .eq("id", pin_id)
    .select(STORE_PIN_SELECT)
    .single();

  if (error) throw error;
  return mapStorePinRow(data as StorePinRow);
}

export async function deleteStorePin(pin_id: string) {
  const { error } = await supabase.from("store_pin").delete().eq("id", pin_id);
  if (error) throw error;
}
