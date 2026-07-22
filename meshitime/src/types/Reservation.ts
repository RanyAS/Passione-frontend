export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "failed"
  | "cancelled";

export interface ReservationStore {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface ReservationPin {
  id: string;
  storeId: string;
  time: string | null;
  emptySeat: number;
  description: string | null;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  store: ReservationStore | null;
}

export interface Reservation {
  id: string;
  userId: string;
  pinId: string;
  status: ReservationStatus;
  partySize: number;
  reservedAt: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  pin: ReservationPin | null;
}

export type CreateReservationPayload = {
  userId: string;
  pinId: string;
  partySize?: number;
  reservedAt?: string | null;
  note?: string | null;
};

export type UpdateReservationPayload = {
  status?: ReservationStatus;
  partySize?: number;
  reservedAt?: string | null;
  note?: string | null;
};