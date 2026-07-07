import { supabase } from "../../lib/supabase";

export async function registerUser(
  email: string,
  password: string,
  username: string,
  address: string,
  account_type: string,
  imagePath?: string,
  tel?: string,
  site?:string,
  businessHours?:string,
  genre?: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        account_type,
        username,
        address,
        tel: tel ?? null,
        site: site ?? null,
        businessHours: businessHours ?? null,
        image_path: imagePath ?? null,
        genre: genre ?? null
      },
    },
  });

  if (error){
    console.error("Error during registration:", error);
    throw error;
  }

  return data;
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}