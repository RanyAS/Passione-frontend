import { DEMO_USER_ID, isPlaceholderId } from "@/constants/session";
import { supabase } from "@/lib/supabase";

/** Priorité : session Supabase Auth → EXPO_PUBLIC_DEMO_USER_ID. */
export async function resolveSessionUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  if (data.user?.id) return data.user.id;

  if (!isPlaceholderId(DEMO_USER_ID)) return DEMO_USER_ID;

  throw new Error(
    "Aucun userId : connecte-toi ou définis EXPO_PUBLIC_DEMO_USER_ID (UUID table users)."
  );
}
