import { Reservation, CreateReservationPayload, UpdateReservationPayload } from "@/types/Reservation";
import api from "./api";

export async function createReservation(payload: CreateReservationPayload): Promise<Reservation> {
    const { data } = await api.post<Reservation>("/api/reservations", payload);
    return data;
}

export async function getReservation(reservation_id: string): Promise<Reservation> {
    const { data } = await api.get<Reservation>(`/api/reservations/${reservation_id}`);
    return data;
}

export async function getReservationsByUser(user_id: string): Promise<Reservation[]> {
    const { data } = await api.get<Reservation[]>("/api/reservations", {
        params: { userId: user_id },
    });
    return data;
}

export async function updateReservation(
    reservation_id: string,
    patch: UpdateReservationPayload
): Promise<Reservation> {
    const { data } = await api.patch<Reservation>(`/api/reservations/${reservation_id}`, patch);
    return data;
}

export async function confirmReservation(reservation_id: string): Promise<Reservation> {
    const { data } = await api.post<Reservation>(`/api/reservations/${reservation_id}/confirm`);
    return data;
}

export async function failReservation(
    reservation_id: string,
    note: string | null = null
): Promise<Reservation> {
    const { data } = await api.post<Reservation>(`/api/reservations/${reservation_id}/fail`, { note });
    return data;
}

export async function cancelReservation(
    reservation_id: string,
    note: string | null = null
): Promise<Reservation> {
    const { data } = await api.post<Reservation>(`/api/reservations/${reservation_id}/cancel`, { note });
    return data;
}

export async function deleteReservation(reservation_id: string) {
    const { data } = await api.delete(`/api/reservations/${reservation_id}`);
    return data;
}
