import { supabase } from "@/lib/supabase";
import type { Review } from "@/types/Review";

type InsertReview = Omit<Review, "id" | "created_at">;

export async function getReview(store_id: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("review")
    .select("*")
    .eq("store_id", store_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Review[];
}

export async function insertReview(review_data: InsertReview): Promise<Review> {
  const { data, error } = await supabase
    .from("review")
    .insert(review_data)
    .select()
    .single();

  if (error) throw error;
  return data as Review;
}

export async function deleteReview(review_id: string): Promise<null> {
  const { error } = await supabase.from("review").delete().eq("id", review_id);
  if (error) throw error;
  return null;
}
