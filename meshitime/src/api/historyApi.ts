import { supabase } from "@/lib/supabase";
import type { History, HistoryWithStore } from "@/types/History";

export type CreateHistory = Omit<History, "id" | "created_at">;

export async function getAllHistory(
  user_id: string
): Promise<HistoryWithStore[]> {
  const { data, error } = await supabase
    .from("history")
    .select("*, stores(*)")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as Array<History & { stores: HistoryWithStore["store"] }>).map(
    (row) => ({
      id: row.id,
      user_id: row.user_id,
      store_id: row.store_id,
      created_at: row.created_at,
      store: row.stores,
    })
  );
}

export async function insertHistory(
  history_data: CreateHistory
): Promise<History> {
  const { data, error } = await supabase
    .from("history")
    .insert(history_data)
    .select()
    .single();

  if (error) throw error;
  return data as History;
}

export async function deleteHistory(history_id: string): Promise<null> {
  const { error } = await supabase
    .from("history")
    .delete()
    .eq("id", history_id);
  if (error) throw error;
  return null;
}
