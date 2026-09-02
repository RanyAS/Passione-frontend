import { supabase } from "@/lib/supabase";
import type {
  CreateReservationPayload,
  Reservation,
  UpdateReservationPayload,
} from "@/types/Reservation";

const RESERVATION_SELECT = `
  id,
  user_id,
  pin_id,
  status,
  party_size,
  reserved_at,
  note,
  created_at,
  updated_at,
  store_pin (
    id,
    store_id,
    time,
    empty_seat,
    description,
    starts_at,
    ends_at,
    is_active,
    stores (
      id,
      sname,
      address,
      latitude,
      longitude
    )
  )
`;

type StoreEmbed = {
  id: string;
  sname: string;
  address: string;
  latitude: number;
  longitude: number;
};

type PinEmbed = {
  id: string;
  store_id: string;
  time: string | null;
  empty_seat: number;
  description: string | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  stores: StoreEmbed | StoreEmbed[] | null;
};

type ReservationRow = {
  id: string;
  user_id: string;
  pin_id: string;
  status: Reservation["status"];
  party_size: number;
  reserved_at: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  store_pin: PinEmbed | PinEmbed[] | null;
};

function asOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function mapReservationRow(row: ReservationRow): Reservation {
  const pin = asOne(row.store_pin);
  const store = asOne(pin?.stores ?? null);

  return {
    id: row.id,
    userId: row.user_id,
    pinId: row.pin_id,
    status: row.status,
    partySize: row.party_size,
    reservedAt: row.reserved_at,
    note: row.note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    pin: pin
      ? {
          id: pin.id,
          storeId: pin.store_id,
          time: pin.time,
          emptySeat: pin.empty_seat,
          description: pin.description,
          startsAt: pin.starts_at,
          endsAt: pin.ends_at,
          isActive: pin.is_active,
          store: store
            ? {
                id: store.id,
                name: store.sname,
                address: store.address,
                latitude: Number(store.latitude),
                longitude: Number(store.longitude),
              }
            : null,
        }
      : null,
  };
}

function asReservationRows(data: unknown): ReservationRow[] {
  return (data ?? []) as ReservationRow[];
}

function asReservationRow(data: unknown): ReservationRow {
  return data as ReservationRow;
}

function buildUpdatePayload(patch: UpdateReservationPayload) {
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (patch.status !== undefined) payload.status = patch.status;
  if (patch.partySize !== undefined) payload.party_size = patch.partySize;
  if (patch.reservedAt !== undefined) payload.reserved_at = patch.reservedAt;
  if (patch.note !== undefined) payload.note = patch.note;
  return payload;
}

export async function createReservation(
  payload: CreateReservationPayload
): Promise<Reservation> {
  if (!payload.userId) throw new Error("userId is required");
  if (!payload.pinId) throw new Error("pinId is required");

  const { data, error } = await supabase
    .from("reservation")
    .insert({
      user_id: payload.userId,
      pin_id: payload.pinId,
      status: "pending",
      party_size: payload.partySize ?? 1,
      reserved_at: payload.reservedAt ?? null,
      note: payload.note ?? null,
    })
    .select(RESERVATION_SELECT)
    .single();

  if (error) throw error;
  return mapReservationRow(asReservationRow(data));
}

export async function getReservation(
  reservation_id: string
): Promise<Reservation> {
  const { data, error } = await supabase
    .from("reservation")
    .select(RESERVATION_SELECT)
    .eq("id", reservation_id)
    .single();

  if (error) throw error;
  return mapReservationRow(asReservationRow(data));
}

export async function getReservationsByUser(
  user_id: string
): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from("reservation")
    .select(RESERVATION_SELECT)
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return asReservationRows(data).map(mapReservationRow);
}

/** Réservations d’un magasin (via join store_pin) — non exposé par l’ancien Express. */
export async function getReservationsByStore(
  store_id: string
): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from("reservation")
    .select(
      `
      id,
      user_id,
      pin_id,
      status,
      party_size,
      reserved_at,
      note,
      created_at,
      updated_at,
      store_pin!inner (
        id,
        store_id,
        time,
        empty_seat,
        description,
        starts_at,
        ends_at,
        is_active,
        stores (
          id,
          sname,
          address,
          latitude,
          longitude
        )
      )
    `
    )
    .eq("store_pin.store_id", store_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return asReservationRows(data).map(mapReservationRow);
}

export async function updateReservation(
  reservation_id: string,
  patch: UpdateReservationPayload
): Promise<Reservation> {
  const { data, error } = await supabase
    .from("reservation")
    .update(buildUpdatePayload(patch))
    .eq("id", reservation_id)
    .select(RESERVATION_SELECT)
    .single();

  if (error) throw error;
  return mapReservationRow(asReservationRow(data));
}

export async function confirmReservation(
  reservation_id: string
): Promise<Reservation> {
  return updateReservation(reservation_id, { status: "confirmed" });
}

export async function failReservation(
  reservation_id: string,
  note: string | null = null
): Promise<Reservation> {
  return updateReservation(reservation_id, { status: "failed", note });
}

export async function cancelReservation(
  reservation_id: string,
  note: string | null = null
): Promise<Reservation> {
  return updateReservation(reservation_id, { status: "cancelled", note });
}

export async function deleteReservation(reservation_id: string) {
  const { error } = await supabase
    .from("reservation")
    .delete()
    .eq("id", reservation_id);
  if (error) throw error;
}
