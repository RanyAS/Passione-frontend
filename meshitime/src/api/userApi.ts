import { User } from "@/types/User";
import api from "./api";

export async function getUser(user_id:string): Promise<User> {
    const { data } = await api.get<User>(`/api/users/${user_id}`);
    return data;
}

export async function updateUser(user_id:string, user_data:Partial<User>): Promise<User> {
    const { data } = await api.put<User>(`/api/users/${user_id}`, user_data);
    return data;
}