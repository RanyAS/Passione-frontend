import { supabase } from "@/lib/supabase";
import type { Genre } from "@/types/Genre";

export async function getGenre(): Promise<Genre[]> {
  const { data, error } = await supabase.from("genre").select("*");
  if (error) throw error;
  return (data ?? []) as Genre[];
}
