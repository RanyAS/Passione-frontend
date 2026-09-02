import { supabase } from "@/lib/supabase";
import type { CreateUserPayload, UpdateUserPayload, User } from "@/types/User";

export async function getUser(user_id: string): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user_id)
    .single();

  if (error) throw error;
  return data as User;
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const insertPayload: Record<string, unknown> = {
    username: payload.username,
    email: payload.email,
    password: payload.password,
    address: payload.address ?? "",
    image_path: payload.image_path ?? "",
  };
  if (payload.id) insertPayload.id = payload.id;

  const { data, error } = await supabase
    .from("users")
    .insert(insertPayload)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function updateUser(
  user_id: string,
  user_data: UpdateUserPayload
): Promise<User> {
  const allowed = [
    "username",
    "email",
    "password",
    "address",
    "image_path",
  ] as const;

  const payload: Record<string, unknown> = {};
  for (const key of allowed) {
    if (user_data[key] !== undefined) payload[key] = user_data[key];
  }

  if (Object.keys(payload).length === 0) {
    throw new Error("No fields to update");
  }

  const { data, error } = await supabase
    .from("users")
    .update(payload)
    .eq("id", user_id)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function deleteUser(user_id: string): Promise<null> {
  const { error } = await supabase.from("users").delete().eq("id", user_id);
  if (error) throw error;
  return null;
}
