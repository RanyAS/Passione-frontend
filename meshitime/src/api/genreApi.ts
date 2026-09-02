import api from "./api"
import { Genre } from "@/types/Genre.js";

export async function getGenre(): Promise<Genre[]> {
    const { data } = await api.get<Genre[]>("/api/genres");
    return data;
}