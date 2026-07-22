export interface StorePinStore {
  id: string;
  name: string;
  address: string;
  tel: string | null;
  openTime: string | null;
  star: number | null;
  site: string | null;
  imagePath: string | null;
  genreId: string | null;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface StorePin {
  id: string;
  storeId: string;
  time: string | null;
  emptySeat: number;
  rule: string | null;
  description: string | null;
  createdAt: string;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  store: StorePinStore;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export type CreateStorePinPayload = {
  storeId: string;
  emptySeat: number;
  time?: string | null;
  rule?: string | null;
  description?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive?: boolean;
};

export type UpdateStorePinPayload = Partial<CreateStorePinPayload>;