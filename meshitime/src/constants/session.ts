/**
 * IDs de session tant que l’auth magasin / client n’est pas branchée.
 * Store : premier magasin présent sur Supabase (yarcsujzlvzbolgkolpd).
 * User : UUID d’un utilisateur `users` ou override via EXPO_PUBLIC_DEMO_USER_ID.
 */
export const DEMO_STORE_ID =
  process.env.EXPO_PUBLIC_DEMO_STORE_ID ??
  "6d0e2426-dd61-4fc8-9b81-c2463d70ef4b";

export const DEMO_USER_ID =
  process.env.EXPO_PUBLIC_DEMO_USER_ID ?? "REPLACE_WITH_REAL_USER_UUID";

export function isPlaceholderId(id: string | null | undefined): boolean {
  if (!id) return true;
  return id.includes("REPLACE_WITH_REAL");
}
