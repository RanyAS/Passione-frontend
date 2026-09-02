export interface Store {
  id: string;
  sname: string;
  email: string;
  password: string;
  address: string;
  tel: string;
  open_time: string;
  star: number;
  site: string;
  image_path: string;
  genre_id: string;
  created_at: string;
  latitude: number;
  longitude: number;
}

/** id / created_at / star は DB 側で扱える */
export type CreateStorePayload = {
  sname: string;
  email: string;
  password: string;
  address: string;
  tel?: string;
  open_time?: string;
  site?: string;
  image_path?: string;
  genre_id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  star?: number | null;
  id?: string;
};

export type UpdateStorePayload = Partial<
  Omit<Store, "id" | "created_at" | "password">
> & {
  password?: string;
};
