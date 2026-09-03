export interface Review {
    id: string;
    store_id: string;
    user_id: string;
    star: number;
    comment: string;
    created_at: string;
}

export interface ApiReview extends Review {
    users: {
        username: string;
    } | null;
}