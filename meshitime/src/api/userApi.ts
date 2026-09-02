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

export async function uploadUserImage(user_id: string, uri: string): Promise<User> {
  const formData = new FormData();

  formData.append("image", {
    uri,
    name: `profile-${user_id}.jpg`,
    type: "image/jpeg",
  } as any);
  const { data } = await api.post<User>(
    `/api/users/${user_id}/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  
  return data;
}