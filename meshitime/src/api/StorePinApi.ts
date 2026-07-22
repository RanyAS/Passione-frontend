import { StorePin, CreateStorePinPayload, UpdateStorePinPayload } from "@/types/StorePin";
import api from "./api";

export async function getStorePins(store_id: string): Promise<StorePin[]> {
    const { data } = await api.get<StorePin[]>(`/api/storepin/store/${store_id}`);
    return data;
}

export async function getActiveStorePins(store_id: string): Promise<StorePin[]> {
    const { data } = await api.get<StorePin[]>(`/api/storepin/store/${store_id}/active`);
    return data;
}

export async function getStorePin(pin_id: string): Promise<StorePin> {
    const { data } = await api.get<StorePin>(`/api/storepin/${pin_id}`);
    return data;
}

export async function createStorePin(payload: CreateStorePinPayload): Promise<StorePin> {
    const { data } = await api.post<StorePin>("/api/storepin", payload);
    return data;
}

export async function updateStorePin(
    pin_id: string,
    patch: UpdateStorePinPayload
): Promise<StorePin> {
    const { data } = await api.patch<StorePin>(`/api/storepin/${pin_id}`, patch);
    return data;
}

export async function deleteStorePin(pin_id: string) {
    const { data } = await api.delete(`/api/storepin/${pin_id}`);
    return data;
}
