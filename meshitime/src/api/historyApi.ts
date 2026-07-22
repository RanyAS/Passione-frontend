import { History, HistoryWithStore } from "@/types/History";
import api from "./api";

export type CreateHistory = Omit<History, "id" | "created_at">;

export async function getAllHistory(user_id:string): Promise<HistoryWithStore[]> {
    const { data } = await api.get<HistoryWithStore[]>(`/api/history/${user_id}`);
    return data;
}

export async function insertHistory(history_data:CreateHistory): Promise<History> {
    const { data } = await api.post<History>("/api/history", history_data);
    return data;
}

export async function deleteHistory(history_id:string): Promise<History | null> {
    const { data } = await api.delete<History | null>(`/api/history/${history_id}`);
    return data;
}