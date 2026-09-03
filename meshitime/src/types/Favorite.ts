import { Store } from "./Store";

export interface Favorite {
    id: string;
    user_id: string;
    store_id: string;
    created_at: string;
}

export interface FavWithStore extends Favorite {
    stores: Store & {
        genre: {
            id: string;
            gname: string;
        } | null;
    };
}