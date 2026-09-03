import { Store } from "./Store";

export interface History {
    id: string;
    user_id: string;
    store_id: string;
    reservation_id: string;
    created_at: string;
}

export interface HistoryWithStore extends History {
    stores: Store;
}