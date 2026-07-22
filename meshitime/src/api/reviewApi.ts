import { Review } from "@/types/Review";
import api from "./api";

type InsertReview = Omit<Review, "id" | "created_at">

export async function getReview(store_id:string): Promise<Review[]> {
    const { data } = await api.get<Review[]>(`/api/review/${store_id}`);
    return data;
}

export async function insertReview(review_data:InsertReview): Promise<Review> {
    const { data } = await api.post<Review>("/api/review", review_data);
    return data;
}

export async function deleteReview(review_id:string): Promise<Review | null> {
    const { data } = await api.delete<Review | null>(`/api/review/${review_id}`);
    return data;
}