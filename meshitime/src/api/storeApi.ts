import { Store } from "@/types/Store";
import api from "./api";

export async function getStoreById(store_id:string): Promise<Store> {
    const { data } = await api.get<Store>(`/api/stores/${store_id}`);
    return data;
}

export async function getStores(genre_id?:string): Promise<Store[]> {
    const { data } = await api.get<Store[]>("/api/stores", {
        params: {
            genre_id,
        },
    })

    return data;
}

export async function updateStore(store_id:string, store_data:Partial<Store>): Promise<Store>  {
    const { data } = await api.put<Store>(`/api/stores/${store_id}`, store_data);
    return data;
}