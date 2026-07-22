import { Menu, CreateMenu } from "@/types/Menu";
import api from "./api";

export type UpdateMenu = Partial<Omit<
    Menu,
    "id" | "created_at" | "store_id"
>>;

export async function getAllMenu(store_id:string): Promise<Menu[]> {
    const { data } = await api.get<Menu[]>(`/api/menu/store/${store_id}`);
    return data;
}

export async function getMenu(menu_id:string): Promise<Menu | null> {
    const { data } = await api.get<Menu | null>(`/api/menu/${menu_id}`);
    return data;
}

export async function insertMenu(menu_data:CreateMenu): Promise<Menu> {
    const { data } = await api.post<Menu>("/api/menu", menu_data);
    return data;
}

export async function updateMenu(menu_id:string, menu_data:UpdateMenu): Promise<Menu | null> {
    const { data } = await api.put<Menu | null>(`/api/menu/${menu_id}`, menu_data);
    return data;
}

export async function deleteMenu(menu_id:string): Promise<Menu | null> {
    const { data } = await api.delete<Menu | null>(`/api/menu/${menu_id}`);
    return data;
}