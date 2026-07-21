import { Timestamp } from "react-native-reanimated/lib/typescript/commonTypes";

export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    address: string;
    image_path: string;
    created_at: Timestamp;
}