import { Discount } from "./Discount";
import { Catchphrase } from "./Catchphrase";

export interface Menu {
    id: string;

    mname: string;
    store_id: string;

    allergen: string;
    ingredients: string;
    description: string;
    image_path: string;

    created_at: string;

    discount_id: string | null;
    catch_id: string | null;

    discounts: Discount | null;
    catchphrase: Catchphrase | null;
}


export interface CreateMenu {
    mname: string;
    store_id: string;

    allergen: string;
    ingredients: string;
    description: string;
    image_path: string;

    discount_id: string | null;
    catch_id: string | null;
}